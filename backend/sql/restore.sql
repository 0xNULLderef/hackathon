-- global

CREATE TABLE quests (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    cover_url TEXT NOT NULL
);

CREATE TABLE quest_images (
    id INTEGER PRIMARY KEY NOT NULL,
    url TEXT NOT NULL,
    name TEXT NOT NULL,
    quest_id INTEGER NOT NULL,

    FOREIGN KEY(quest_id) REFERENCES quests(id)
);

CREATE TABLE achievements (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL
);

-- user related

CREATE TABLE users (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE user_quest_images_completed (
    id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    quest_image_id INTEGER NOT NULL,

    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(quest_image_id) REFERENCES quest_images(id),
    UNIQUE(user_id, quest_image_id)
);

CREATE TABLE user_achievements (
    id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    achievement_id INTEGER NOT NULL,

    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(achievement_id) REFERENCES achievements(id)
);

-- data

INSERT INTO quests (id, name, cover_url) VALUES (1, 'CKZiU Jaworzno', 'IMG_20250617_121752980_HDR.jpg');
INSERT INTO quests (id, name, cover_url) VALUES (2, 'Cekaziutek', 'IMG_20250617_121813889_HDR.jpg');
INSERT INTO quests (id, name, cover_url) VALUES (3, 'Elektrownia III Jaworzno', 'IMG_20250617_121654925_HDR.jpg');

INSERT INTO quest_images (id, name, url, quest_id) VALUES (1, 'Rura', 'IMG_20250617_121625927_HDR.jpg', 1);
INSERT INTO quest_images (id, name, url, quest_id) VALUES (2, 'Budynek', 'IMG_20250617_121654925_HDR.jpg', 1);
INSERT INTO quest_images (id, name, url, quest_id) VALUES (3, 'Ławka', 'IMG_20250617_121752980_HDR.jpg', 2);
INSERT INTO quest_images (id, name, url, quest_id) VALUES (4, 'Cekaziutek', 'IMG_20250617_121813889_HDR.jpg', 3);

INSERT INTO achievements (id, name, url) VALUES (1, 'Pierwsze znalezisko', 'first_find.png');
INSERT INTO achievements (id, name, url) VALUES (2, 'Początek kolekcji', 'three_find.png');
INSERT INTO achievements (id, name, url) VALUES (3, 'Wysokie ambicje', 'five_find.png');

-- user data

INSERT INTO users (id, name) VALUES (1, 'stefek');

INSERT INTO user_quest_images_completed (user_id, quest_image_id) VALUES (1, 2);
INSERT INTO user_quest_images_completed (user_id, quest_image_id) VALUES (1, 3);

INSERT INTO user_achievements (user_id, achievement_id) VALUES (1, 1);
