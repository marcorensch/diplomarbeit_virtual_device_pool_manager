CREATE TABLE IF NOT EXISTS `roles` (
    id int(11) NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    hidden TEXT NOT NULL,
    PRIMARY KEY (id)
)
    ENGINE=InnoDB
    DEFAULT CHARSET=utf8
    COLLATE = utf8_general_ci;
