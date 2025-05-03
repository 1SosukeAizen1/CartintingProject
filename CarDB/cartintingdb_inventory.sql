-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: cartintingdb
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `ItemID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) DEFAULT NULL,
  `Quantity` int DEFAULT NULL,
  `Supplier` varchar(50) DEFAULT NULL,
  `ReorderLevel` int DEFAULT NULL,
  PRIMARY KEY (`ItemID`),
  CONSTRAINT `inventory_chk_1` CHECK ((`Quantity` >= 0)),
  CONSTRAINT `inventory_chk_2` CHECK ((`ReorderLevel` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (10,'Automotive Window Tinting',50,'Supplier A',47),(11,'Standard dyed film',100,'Supplier B',54),(12,'Ceramic tint',30,'Supplier C',30),(13,'Carbon tint',40,'Supplier D',86),(14,'Metalized film',25,'Supplier E',38),(15,'Infrared rejection tint',20,'Supplier F',34),(16,'UV protection film',60,'Supplier G',53),(17,'Privacy tints',70,'Supplier H',63),(18,'Legal limit tinting (by state laws)',80,'Supplier I',57),(19,'Tint Removal',90,'Supplier J',95),(20,'Safe removal of old or bubbling tint films',35,'Supplier K',4),(22,'Gradient or decorative tinting',20,'Supplier M',35),(23,'Colored or mirrored tints',10,'Supplier N',61),(24,'Custom logos or designs etched into tint',5,'Supplier O',99),(25,'anti flare',65,'Supplier W',14),(26,'New Ceramic Tint',170,'Supplier HH',22);
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-03  2:13:20
