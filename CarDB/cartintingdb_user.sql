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
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `Role` varchar(30) DEFAULT NULL,
  `ResetTokenExpiration` datetime DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Email` (`Email`),
  CONSTRAINT `user_chk_1` CHECK ((`Role` in (_utf8mb4'admin',_utf8mb4'employee',_utf8mb4'customer')))
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (44,'jok','jok@g.vom','44444','customer',NULL),(48,'johnathan1','johnathan1@gmail.com','$2b$10$sfkUG7w.KbBkafwPdJI5m.gK4fAulDnaGupkzGDSTPn6aMRlCfkuO','employee',NULL),(49,'one piece','lol@gmail.com','$2b$10$WclE4Z5w5ENK5FCD48jwqu357fkmpJEI.U7RU1BhyCL0unreQ0V7O','employee',NULL),(51,'hona','hona@gmail.com','$2b$10$FQyTqDEWIukRY1B3wr31e.NSIfCU.AH/6IzEMHNruXoVpm9gB/cBW','employee',NULL),(52,'client','client@gmail.com','$2b$10$P8.l3JYAo5PhEiFjdEB17uDYxQe0.r7IPI64B2O5Hj9ml4Y2cLz9O','customer',NULL),(53,'employee','employee@gmail.com','$2b$10$eei.pvXRmZMUzKb4PZ6zrO9BzEB4DZHhOQTtttoL51rtE2I2Uf8Ga','employee',NULL),(54,'Youssef','aizengoku1@gmail.com','$2b$10$yQgPdpzJlgazIGW3uGQgUOjfxr/qz.lImDXSSUf4t1r1qikbvfwZi','admin',NULL),(55,'Sosuke','sosukeaizen988@gmail.com','$2b$10$gsjGVSTv0M4goAFAMhjaruKuQ4cv9LARUMQot2gDx6f6TREbc3DRq','employee',NULL),(56,'Goku','gokusaturo526@gmail.com','$2b$10$suQjIcGdW62gThYmcc.N1.Njc.YJmD3FMy4.jR9f3e39fBK1yzeMa','customer',NULL),(57,'clientT','t@kaka.com','$2b$10$w.Xjo4CXrEUfFpfZfs8u3OWDhV1WI2eWzlbStAZbWo9rbJMUxQWOG','customer',NULL),(58,'Naruto','Naruto@gmail.com','$2b$10$k0IEOF7RSt29ULGL/Q1gd.4.aXLsu3ozbbar0hjSODNQQJz1jyauu','customer',NULL),(59,'Madara','madara@gmail.com','$2b$10$SRscLRPjiD/y2GDoK4XU6eceTRqCxszHk.a5AA47WD.lyVkFABDwa','employee',NULL),(60,'Sasuke','Sasuke@gmail.com','$2b$10$jqbAcLhVFd9AmniYQSlmQOVnIdz4Oh3RQ//KKRR4SOf9xRga434n2','employee',NULL),(62,'paul','paul@gmail.com','$2b$10$HZYJmGYtiuGgr/aNaq23XukvZEZ1dncp9dez0OqRq5xWAyB/nWVEK','employee',NULL),(63,'Erick','Erick@gmail.com','$2b$10$IqJHyPH8kWAXdNlvX1u7SOh8jnK8a4/jyiqsduuiPefuqs0DNMnjO','employee',NULL),(64,'Dar','dar@gmail.com','$2b$10$28Y5sfCKxbf16LdVeujB4eSNikqwa9VWvAzJKtQXq1qBBIAy1goVm','employee',NULL),(65,'Omar','Omar@gmail.com','$2b$10$xo81Oqyp.dUSN85yKAkszui40IiH.OtLNGoraj0.QWVKOlkQxWtwq','customer',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
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
