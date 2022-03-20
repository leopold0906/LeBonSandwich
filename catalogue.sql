# create database
CREATE DATABASE IF NOT EXISTS `catalogue`;

# create grant rights to root and user
GRANT ALL PRIVILEGES ON *.* TO root;
GRANT ALL PRIVILEGES ON *.* TO user;


# create collections
DROP TABLE IF EXISTS `catalogue`.`category`;
CREATE TABLE `catalogue`.`category` (
                                    `id` int(11) NOT NULL AUTO_INCREMENT,
                                    `nom` varchar(128) NOT NULL,
                                    `description` varchar(256) NOT NULL,
                                    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `catalogue`.`sandwich`;
CREATE TABLE `catalogue`.`sandwich` (
                                 `id` int(11) NOT NULL AUTO_INCREMENT,
                                 `nom` varchar(256) NOT NULL,
                                 `description` varchar(256) NOT NULL,
                                 `type_pain` varchar(128) NOT NULL,
                                 `image` blob DEFAULT NULL,
                                 `categories` int(11) NOT NULL,
                                 `prix` float(6,2) NOT NULL,
                                 FOREIGN KEY (`categories`) REFERENCES category(`id`),
                                 PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

