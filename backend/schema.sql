-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema e-commerce
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema e-commerce
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `e-commerce` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `e-commerce` ;

-- -----------------------------------------------------
-- Table `e-commerce`.`brands`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `e-commerce`.`brands` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `volume` INT NOT NULL,
  `logo` TEXT NOT NULL,
  `floorprice` INT NOT NULL,
  `day` TEXT NULL DEFAULT NULL,
  `owner` INT NULL DEFAULT NULL,
  `verified` TINYINT NULL DEFAULT NULL,
  `items` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 21
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `e-commerce`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `e-commerce`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(50) NOT NULL,
  `lastName` VARCHAR(50) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `avatar` VARCHAR(1000) NULL DEFAULT NULL,
  `background` VARCHAR(1000) NULL DEFAULT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `day` INT NULL DEFAULT NULL,
  `year` INT NULL DEFAULT NULL,
  `month` VARCHAR(255) NULL DEFAULT NULL,
  `type` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  `banned` TINYINT(1) NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email` (`email` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `e-commerce`.`carts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `e-commerce`.`carts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `totalItems` INT NOT NULL DEFAULT '0',
  `totalAmount` DECIMAL(10,2) NOT NULL DEFAULT '0.00',
  `UserId` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `UserId` (`UserId` ASC) VISIBLE,
  CONSTRAINT `carts_ibfk_1`
    FOREIGN KEY (`UserId`)
    REFERENCES `e-commerce`.`users` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `e-commerce`.`products`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `e-commerce`.`products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `rarity` ENUM('Secret Rare', 'Uncommon Rare', 'Ultra Rare') NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `image` VARCHAR(10000) NOT NULL,
  `status` ENUM('New', 'Available', 'Not Available') NOT NULL DEFAULT 'Available',
  `onSale` TINYINT(1) NULL DEFAULT '0',
 `collection` ENUM('Shoes', 'Dresses', 'Coats', 'Shirts', 'Pants', 'Jackets', 'Hats', 'Scarves', 'Gloves') NOT NULL,
  `stock` INT NOT NULL DEFAULT '0',
  `brandId` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `brandId` (`brandId` ASC) VISIBLE,
  CONSTRAINT `products_ibfk_1`
    FOREIGN KEY (`brandId`)
    REFERENCES `e-commerce`.`brands` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 319
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `e-commerce`.`cartproducts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `e-commerce`.`cartproducts` (
  `quantity` INT NOT NULL DEFAULT '1',
  `priceAtPurchase` DECIMAL(10,2) NOT NULL,
  `cartId` INT NOT NULL,
  `ProductId` INT NOT NULL,
  PRIMARY KEY (`cartId`, `ProductId`),
  INDEX `ProductId` (`ProductId` ASC) VISIBLE,
  CONSTRAINT `cartproducts_ibfk_1`
    FOREIGN KEY (`cartId`)
    REFERENCES `e-commerce`.`carts` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `cartproducts_ibfk_2`
    FOREIGN KEY (`ProductId`)
    REFERENCES `e-commerce`.`products` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `e-commerce`.`favourites`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `e-commerce`.`favourites` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `added_at` DATETIME NULL DEFAULT NULL,
  `UserId` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `UserId` (`UserId` ASC) VISIBLE,
  CONSTRAINT `favourites_ibfk_1`
    FOREIGN KEY (`UserId`)
    REFERENCES `e-commerce`.`users` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `e-commerce`.`posts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `e-commerce`.`posts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `content` TEXT NOT NULL,
  `image` VARCHAR(255) NULL DEFAULT NULL,
  `UserId` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `UserId` (`UserId` ASC) VISIBLE,
  CONSTRAINT `posts_ibfk_1`
    FOREIGN KEY (`UserId`)
    REFERENCES `e-commerce`.`users` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 41
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `e-commerce`.`user_favorites`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `e-commerce`.`user_favorites` (
  `FavouriteId` INT NOT NULL,
  `ProductId` INT NOT NULL,
  PRIMARY KEY (`FavouriteId`, `ProductId`),
  INDEX `ProductId` (`ProductId` ASC) VISIBLE,
  CONSTRAINT `user_favorites_ibfk_1`
    FOREIGN KEY (`FavouriteId`)
    REFERENCES `e-commerce`.`favourites` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `user_favorites_ibfk_2`
    FOREIGN KEY (`ProductId`)
    REFERENCES `e-commerce`.`products` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
