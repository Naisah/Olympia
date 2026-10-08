<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\News;
use App\Models\Album;
use App\Models\AlbumPhoto;
use App\Models\Business;

class ContentSeeder extends Seeder
{
    public function run()
    {
        // 1. Seed News
        $news = [
            // Featured
            [
                'title' => '🎒 PRE-K1 ENROLLMENT FOR SY. 2026-2027 📚',
                'image_url' => '/assets/images/Screenshot 2026-05-14 at 11.49.35 AM 1.png',
                'published_date_string' => 'May 11 - 29, 2026',
                'is_featured' => true,
                'content' => '',
            ],
            [
                'title' => '🩺 FREE NCD RISK ASSESSMENT 🩺',
                'image_url' => '/assets/images/Screenshot 2026-05-14 at 11.51.52 AM 1.png',
                'published_date_string' => 'May 8, 2026',
                'is_featured' => true,
                'content' => '',
            ],
            [
                'title' => '🧠 🎂🎉𝐌𝐚𝐥𝐢𝐠𝐚𝐲𝐚𝐧𝐠 𝐊𝐚𝐚𝐫𝐚𝐰𝐚𝐧, 𝗧𝗥𝗘𝗔𝗦. 𝗟𝗢𝗥𝗘𝗟𝗜𝗘 𝗔. 𝗠𝗔𝗠𝗨𝗬𝗔𝗖 🎉🎂',
                'image_url' => '/assets/images/Screenshot 2026-05-14 at 11.57.21 AM 1.png',
                'published_date_string' => 'May 8, 2026',
                'is_featured' => true,
                'content' => '',
            ],
            // Latest
            ['title' => "Brgy. Olympia urged to deploy 'Libreng Sakay' operations after diesel prices disrupt public transport", 'published_date_string' => 'April 24, 2026', 'is_featured' => false, 'image_url' => null, 'content' => ''],
            ['title' => 'TNVS driver shot dead in Brgy. Olympia, Makati City, suspects yet to be identified', 'published_date_string' => 'April 19, 2026', 'is_featured' => false, 'image_url' => null, 'content' => ''],
            ['title' => 'NBI, PDEA raid Brgy. Olympia home for smuggling ₱37M-worth of shabu', 'published_date_string' => 'April 13, 2026', 'is_featured' => false, 'image_url' => null, 'content' => ''],
            ['title' => "Makati student expelled for using 'fart spray' to halt final exams", 'published_date_string' => 'April 2, 2026', 'is_featured' => false, 'image_url' => null, 'content' => ''],
            ['title' => 'Chick Chicken sued by students for raising meal prices', 'published_date_string' => 'March 26, 2026', 'is_featured' => false, 'image_url' => null, 'content' => ''],
            ['title' => 'Maynilad to undergo maintenance on portions of J.P Rizal Street, residents complain of non-stop maintenance works', 'published_date_string' => 'March 14, 2026', 'is_featured' => false, 'image_url' => null, 'content' => ''],
            ['title' => 'BFP to commence fire drills across Makati City schools', 'published_date_string' => 'March 8, 2026', 'is_featured' => false, 'image_url' => null, 'content' => ''],
            ['title' => '🎂🎉 Maligayang Kaarawan, TREAS. LORELIE A. MAMUYAC 🎉🎂', 'published_date_string' => 'May 8, 2026', 'is_featured' => false, 'image_url' => null, 'content' => ''],
            ['title' => 'Makati traffic enforcer lauded for saving infant from burning car', 'published_date_string' => 'February 18, 2026', 'is_featured' => false, 'image_url' => null, 'content' => ''],
            ['title' => 'NBI, PNP, Makati Police District raid scam-operation ring in Brgy. Olympia, Makati City', 'published_date_string' => 'February 15, 2026', 'is_featured' => false, 'image_url' => null, 'content' => ''],
            ['title' => 'PNP, NBI to launch investigation after kidnapping incident in Makati City', 'published_date_string' => 'February 10, 2026', 'is_featured' => false, 'image_url' => null, 'content' => ''],
            ['title' => 'Woman kidnapped by alleged Chinese POGO in Makati City', 'published_date_string' => 'February 7, 2026', 'is_featured' => false, 'image_url' => null, 'content' => ''],
        ];

        foreach ($news as $n) {
            News::create($n);
        }

        // 2. Seed Albums and Photos
        $galleryData = [
            "2026" => [
                [
                    "title" => "104th Plt Off First Day",
                    "cover" => "/assets/images/gallery1.png",
                    "photos" => [
                        [ "url" => "/assets/images/gallery1.png", "caption" => "104th Plt Off First Day - Opening Ceremony" ],
                        [ "url" => "/assets/images/gallery2.png", "caption" => "104th Plt Off First Day - Community Presentation" ],
                        [ "url" => "/assets/images/gallery3.png", "caption" => "104th Plt Off First Day - Group Photo with Barangay Officials" ],
                        [ "url" => "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200&q=80", "caption" => "104th Plt Off First Day - Briefing Session" ]
                    ]
                ]
            ],
            "2025" => [
                [
                    "title" => "104th Plt Off First Day",
                    "cover" => "/assets/images/gallery2.png",
                    "photos" => [
                        [ "url" => "/assets/images/gallery2.png", "caption" => "104th Plt Off First Day 2025" ],
                        [ "url" => "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1200&q=80", "caption" => "Working together on Barangay projects" ],
                        [ "url" => "https://images.unsplash.com/photo-1577416412292-747c6607f055?w=1200&q=80", "caption" => "Planning new community facilities" ]
                    ]
                ],
                [
                    "title" => "Family Day 2025",
                    "cover" => "/assets/images/gallery3.png",
                    "photos" => [
                        [ "url" => "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&q=80", "caption" => "Family Day - Picnic at the Covered Court" ],
                        [ "url" => "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1200&q=80", "caption" => "Outdoor games for families" ],
                        [ "url" => "https://images.unsplash.com/photo-1476900543704-4312b78631f6?w=1200&q=80", "caption" => "Children running and playing outdoors" ],
                        [ "url" => "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=80", "caption" => "Happy family capturing memories" ]
                    ]
                ],
                [
                    "title" => "Kapitana Giveaway 2025",
                    "cover" => "/assets/images/gallery1.png",
                    "photos" => [
                        [ "url" => "/assets/images/gallery1.png", "caption" => "Kapitana Giveaway - Preparing relief goods" ],
                        [ "url" => "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80", "caption" => "Community charity and food distribution" ],
                        [ "url" => "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&q=80", "caption" => "Volunteer team helping Barangay residents" ],
                        [ "url" => "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1200&q=80", "caption" => "Distributing hygiene packs" ]
                    ]
                ]
            ],
            "2024" => [
                [
                    "title" => "Children's Month 2024",
                    "cover" => "/assets/images/gallery3.png",
                    "photos" => [
                        [ "url" => "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=1200&q=80", "caption" => "Children's Month Celebration - Games and fun" ],
                        [ "url" => "https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=1200&q=80", "caption" => "Art and drawing contest for kids" ],
                        [ "url" => "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&q=80", "caption" => "Group photo of active children" ],
                        [ "url" => "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&q=80", "caption" => "Barangay playground fun" ]
                    ]
                ],
                [
                    "title" => "Trick or Treat 2024",
                    "cover" => "/assets/images/gallery2.png",
                    "photos" => [
                        [ "url" => "https://images.unsplash.com/photo-1508349937151-22b68b72d5b1?w=1200&q=80", "caption" => "Trick or Treat - Beautiful pumpkin lanterns" ],
                        [ "url" => "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=1200&q=80", "caption" => "Children showing off creative costumes" ],
                        [ "url" => "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1200&q=80", "caption" => "Fun decorations around the Barangay hall" ]
                    ]
                ],
                [
                    "title" => "Kapitana Giveaway 2024",
                    "cover" => "/assets/images/gallery1.png",
                    "photos" => [
                        [ "url" => "/assets/images/gallery1.png", "caption" => "Kapitana Giveaway 2024 - Distribution Drive" ],
                        [ "url" => "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80", "caption" => "Food packs distribution to Barangay families" ],
                        [ "url" => "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&q=80", "caption" => "Active volunteers during Kapitana Giveaway" ]
                    ]
                ]
            ]
        ];

        foreach ($galleryData as $year => $albums) {
            foreach ($albums as $aData) {
                $album = Album::create([
                    'title' => $aData['title'],
                    'year' => (string)$year,
                    'cover_image_url' => $aData['cover']
                ]);

                foreach ($aData['photos'] as $pData) {
                    AlbumPhoto::create([
                        'album_id' => $album->id,
                        'image_url' => $pData['url'],
                        'caption' => $pData['caption']
                    ]);
                }
            }
        }

        // 3. Seed Businesses
        $businesses = [
            // Food
            [
                'category' => 'Food Businesses',
                'name' => 'Chick Chicken',
                'image_url' => '/assets/images/img1.png',
                'address' => '3231 ZAPOTE, MAKATI CITY, METRO MANILA',
                'details' => ['Chicken restaurant', '₱150 per person', 'Open • Closes 10 PM'],
                'maps_url' => 'https://maps.google.com/?q=3231+Zapote+Makati+City'
            ],
            [
                'category' => 'Food Businesses',
                'name' => 'Mang Inasal Reposo',
                'image_url' => '/assets/images/img2.png',
                'address' => 'MANG INASAL CORNER JP RIZAL, CARDONA',
                'details' => ['Fast food restaurant', '₱150 per person', 'Open • Closes 9 PM'],
                'maps_url' => 'https://maps.google.com/?q=Mang+Inasal+Reposo+Makati'
            ],
            [
                'category' => 'Food Businesses',
                'name' => 'Fariñas Ilocos Empanada',
                'image_url' => '/assets/images/img3.png',
                'address' => '2022 M. LAYUG, MAKATI CITY, 1210',
                'details' => ['Restaurant', '₱150 per person', 'Open 24 Hours'],
                'maps_url' => 'https://maps.google.com/?q=Farinas+Ilocos+Empanada+Makati'
            ],
            // Laundry
            [
                'category' => 'Laundry Businesses',
                'name' => 'Express Wash',
                'image_url' => '/assets/images/img4.png',
                'address' => '692 J. P. RIZAL ST, MAKATI CITY',
                'details' => ['Open 24 hours', 'Laundromat', '4.4/5 Ratings'],
                'maps_url' => 'https://maps.google.com/?q=Express+Wash+Makati'
            ],
            [
                'category' => 'Laundry Businesses',
                'name' => 'Save5 Olympia Laundry Center',
                'image_url' => '/assets/images/img5.png',
                'address' => 'H2CF+G2C, OLYMPIA, MAKATI CITY',
                'details' => ['Open • Closes 8 PM', 'Laundry Service', '0916 891 2788'],
                'maps_url' => 'https://maps.google.com/?q=Save5+Olympia+Laundry+Center'
            ],
            [
                'category' => 'Laundry Businesses',
                'name' => 'Washengo Do-It-Yourself',
                'image_url' => '/assets/images/img6.png',
                'address' => 'CORNER NICANOR GARCIA, MILAGROS, MAKATI',
                'details' => ['Open • Closes 8 PM', 'Laundry Service', '0277296418'],
                'maps_url' => 'https://maps.google.com/?q=Washengo+Makati'
            ],
            // Coffee
            [
                'category' => 'Coffee Shops',
                'name' => 'LT&C Coffee',
                'image_url' => '/assets/images/img7.png',
                'address' => 'J.P. RIZAL, MAKATI CITY',
                'details' => ['Coffee Shop', 'Open 9 AM - 9 PM'],
                'maps_url' => 'https://maps.google.com/?q=LT%26C+Coffee+Makati'
            ],
            [
                'category' => 'Coffee Shops',
                'name' => 'Fresh Grinds Cafe',
                'image_url' => '/assets/images/img8.png',
                'address' => 'POBLACION, MAKATI CITY',
                'details' => ['Café', 'Open 10 AM - 10 PM'],
                'maps_url' => 'https://maps.google.com/?q=Fresh+Grinds+Cafe+Makati'
            ],
            [
                'category' => 'Coffee Shops',
                'name' => 'But First Coffee',
                'image_url' => '/assets/images/img9.png',
                'address' => 'MILANO RESIDENCES, MAKATI',
                'details' => ['Coffee Shop', 'Open 24 Hours'],
                'maps_url' => 'https://maps.google.com/?q=But+First+Coffee+Makati'
            ],
            // Others
            [
                'category' => 'Others',
                'name' => 'Auto Service Center',
                'image_url' => '/assets/images/img10.png',
                'address' => 'J.P. RIZAL, MAKATI CITY',
                'details' => ['Car Repair'],
                'maps_url' => 'https://maps.google.com/?q=Auto+Service+Center+Makati'
            ],
            [
                'category' => 'Others',
                'name' => 'Circuit Hostel',
                'image_url' => '/assets/images/img11.png',
                'address' => 'HIPPODROMO, MAKATI CITY',
                'details' => ['Hotel'],
                'maps_url' => 'https://maps.google.com/?q=Circuit+Hostel+Makati'
            ],
            [
                'category' => 'Others',
                'name' => 'Animal Care Facility',
                'image_url' => '/assets/images/img12.png',
                'address' => 'OSMEÑA, MAKATI CITY',
                'details' => ['Government Service'],
                'maps_url' => 'https://maps.google.com/?q=Makati+City+Animal+Care+Facility'
            ],
        ];

        foreach ($businesses as $b) {
            Business::create($b);
        }
    }
}
