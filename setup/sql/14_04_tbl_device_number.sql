CREATE TABLE IF NOT EXISTS `device_number`
(
    `id`         int(11)  NOT NULL AUTO_INCREMENT,
    `device_id`  int(11)  NOT NULL,
    `number_id`  int(11)  NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `unique_number` UNIQUE (`number_id`),
    CONSTRAINT `devices_numbers_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `devices_numbers_ibfk_2` FOREIGN KEY (`number_id`) REFERENCES `numbers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE

) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8
  COLLATE = utf8_general_ci;