<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Event;
use App\Models\BlogPost;
use App\Models\Production;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Admin user ────────────────────────────────────────────────────────
        $admin = User::firstOrCreate(
            ['email' => 'admin@association.fr'],
            [
                'name'                  => 'Admin',
                'password'              => Hash::make('password'),
                'role'                  => 'admin',
                'membership_status'     => 'active',
                'membership_expires_at' => now()->addYear(),
            ]
        );

        // ── Sample member ─────────────────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'membre@example.com'],
            [
                'name'                  => 'Marie Dupont',
                'password'              => Hash::make('password'),
                'role'                  => 'member',
                'membership_status'     => 'active',
                'membership_expires_at' => now()->addMonths(8),
            ]
        );

        // ── Events ────────────────────────────────────────────────────────────
        $eventData = [
            [
                'title'        => 'Concert de printemps',
                'category'     => 'Concert',
                'location'     => 'Salle des fêtes, Paris 11e',
                'start_date'   => now()->addDays(14),
                'price'        => 12.00,
                'capacity'     => 120,
                'excerpt'      => 'Un concert mêlant jazz et musiques du monde.',
                'description'  => 'Rejoignez-nous pour notre concert annuel de printemps, ...',
                'is_published' => true,
            ],
            [
                'title'        => 'Atelier d\'écriture',
                'category'     => 'Workshop',
                'location'     => 'Médiathèque, Paris 20e',
                'start_date'   => now()->addDays(21),
                'price'        => 0.00,
                'capacity'     => 20,
                'excerpt'      => 'Atelier gratuit ouvert à tous niveaux.',
                'description'  => 'Découvrez l\'écriture créative dans une ambiance bienveillante ...',
                'is_published' => true,
            ],
            [
                'title'        => 'Exposition photo annuelle',
                'category'     => 'Exhibition',
                'location'     => 'Galerie associative, Paris 10e',
                'start_date'   => now()->addDays(35),
                'end_date'     => now()->addDays(49),
                'price'        => 5.00,
                'capacity'     => null,
                'excerpt'      => 'Deux semaines de photographie contemporaine.',
                'description'  => 'Vingt photographes amateurs et professionnels présentent ...',
                'is_published' => true,
            ],
        ];

        foreach ($eventData as $data) {
            $data['slug'] = Str::slug($data['title']) . '-' . Str::random(4);
            Event::firstOrCreate(['title' => $data['title']], $data);
        }

        // ── Blog posts ────────────────────────────────────────────────────────
        $posts = [
            [
                'title'        => 'Retour sur notre saison 2024',
                'excerpt'      => 'Une année riche en rencontres, projets et émotions.',
                'body'         => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
                'is_published' => true,
                'published_at' => now()->subDays(10),
            ],
            [
                'title'        => 'Comment devenir bénévole ?',
                'excerpt'      => 'Tout ce que vous devez savoir pour rejoindre notre équipe.',
                'body'         => 'Vous souhaitez vous impliquer dans la vie culturelle de votre quartier ? Voici comment...',
                'is_published' => true,
                'published_at' => now()->subDays(4),
            ],
            [
                'title'        => 'Appel à projets 2025',
                'excerpt'      => 'Soumettez votre projet avant le 30 juin.',
                'body'         => 'Dans le cadre de notre programme annuel, nous lançons un appel à projets ouvert...',
                'is_published' => true,
                'published_at' => now()->subDays(1),
            ],
        ];

        foreach ($posts as $post) {
            $post['author_id'] = $admin->id;
            $post['slug']      = Str::slug($post['title']) . '-' . Str::random(4);
            BlogPost::firstOrCreate(['title' => $post['title']], $post);
        }

        // ── Productions ───────────────────────────────────────────────────────
        $productions = [
            [
                'title'        => 'Nuits de la mémoire',
                'year'         => 2024,
                'description'  => 'Un spectacle de théâtre documentaire sur la mémoire collective.',
                'is_published' => true,
            ],
            [
                'title'        => 'Fragments urbains',
                'year'         => 2023,
                'description'  => 'Exposition photo-sonore dans les rues de Paris.',
                'is_published' => true,
            ],
            [
                'title'        => 'Chœur des invisibles',
                'year'         => 2022,
                'description'  => 'Concert participatif mêlant habitants et artistes professionnels.',
                'is_published' => true,
            ],
        ];

        foreach ($productions as $prod) {
            $prod['slug'] = Str::slug($prod['title']) . '-' . Str::random(4);
            Production::firstOrCreate(['title' => $prod['title']], $prod);
        }

        $this->command->info('✅ Seed complete — admin: admin@association.fr / password');
    }
}
