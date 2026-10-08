<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class ProtectIdentityFiles extends Command
{
    protected $signature = 'identity:protect-files {--dry-run : Count public ID files without changing them}';
    protected $description = 'Move legacy public ID images to private storage, verifying each copy before removing its public copy';

    public function handle(): int
    {
        $public = Storage::disk('public');
        $private = Storage::disk('local');
        $paths = $public->allFiles('id_images');
        $this->info(count($paths) . ' public ID files found.');
        if ($this->option('dry-run')) return self::SUCCESS;
        $moved = 0;
        foreach ($paths as $path) {
            if (!preg_match('#^id_images/[a-zA-Z0-9_.-]+$#D', $path)) {
                $this->error('Unexpected ID filename. No files with unexpected paths will be moved.');
                return self::FAILURE;
            }
            $contents = $public->get($path);
            if (!$private->exists($path) && !$private->put($path, $contents)) {
                $this->error('Private copy failed; the original has been kept.');
                return self::FAILURE;
            }
            if (!hash_equals(hash('sha256', $contents), hash('sha256', $private->get($path)))) {
                $this->error('Private copy differs; the original has been kept.');
                return self::FAILURE;
            }
            if (!$public->delete($path)) {
                $this->error('Verified private copy exists, but public copy removal failed.');
                return self::FAILURE;
            }
            $moved++;
        }
        $this->info($moved . ' ID files protected.');
        return self::SUCCESS;
    }
}
