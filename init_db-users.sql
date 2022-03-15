# create database
CREATE DATABASE IF NOT EXISTS `users`;

# create grant rights to root and user
GRANT ALL PRIVILEGES ON *.* TO root;
GRANT ALL PRIVILEGES ON *.* TO user;


# create collections
DROP TABLE IF EXISTS `users`.`admin`;
CREATE TABLE `users`.`admin` (
                             `uuid` varchar(36) NOT NULL,
                             `login` varchar(128) NOT NULL,
                             `mail_admin` varchar(256) NOT NULL,
                             `passwd` varchar(256) NOT NULL,
                             `created_at` datetime DEFAULT NULL,
                             PRIMARY KEY (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `users`.`client`;
CREATE TABLE `users`.`client` (
                               `uuid` varchar(36) NOT NULL AUTO_INCREMENT,
                               `nom_client` varchar(128) NOT NULL,
                               `mail_client` varchar(256) NOT NULL,
                               `passwd` varchar(256) NOT NULL,
                               `cumul_achats` decimal(8,2) DEFAULT NULL,
                               `created_at` datetime DEFAULT NULL,
                               `updated_at` datetime DEFAULT NULL,
                               PRIMARY KEY (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;