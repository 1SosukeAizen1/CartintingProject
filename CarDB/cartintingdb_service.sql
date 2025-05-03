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
-- Table structure for table `service`
--

DROP TABLE IF EXISTS `service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service` (
  `ServiceID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) DEFAULT NULL,
  `Description` text,
  `Price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`ServiceID`),
  CONSTRAINT `service_chk_1` CHECK ((`Price` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service`
--

LOCK TABLES `service` WRITE;
/*!40000 ALTER TABLE `service` DISABLE KEYS */;
INSERT INTO `service` VALUES (1,'Automotive Window Tinting','High-quality automotive window tinting for enhanced privacy and UV protection.',130.00),(2,'Standard dyed film','Affordable dyed film for basic tinting needs.',100.00),(3,'Ceramic tint','Premium ceramic tint for superior heat rejection and clarity.',250.00),(4,'Carbon tint','Durable carbon tint with a sleek matte finish.',200.00),(5,'Metalized film','Metalized tint for enhanced durability and glare reduction.',180.00),(6,'Infrared rejection tint','Advanced tint for maximum infrared heat rejection.',300.00),(7,'UV protection film','Specialized film for blocking harmful UV rays.',120.00),(8,'Privacy tints','Dark tints for increased privacy and security.',140.00),(9,'Legal limit tinting (by state laws)','Tinting services compliant with state regulations.',130.00),(10,'Tint Removal','Professional removal of old or damaged tint films.',80.00),(11,'Safe removal of old or bubbling tint films','Careful removal of bubbling or deteriorated tint films.',90.00),(12,'Custom Tinting','Custom tinting solutions tailored to your needs.',300.00),(13,'Gradient or decorative tinting','Stylish gradient or decorative tinting options.',220.00),(14,'Colored or mirrored tints','Unique colored or mirrored tints for a bold look.',250.00),(15,'Custom logos or designs etched into tint','Personalized logos or designs etched into the tint.',350.00);
/*!40000 ALTER TABLE `service` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-03  2:13:21
