CREATE TABLE IF NOT EXISTS `builder_items`
(
    id          int(11)      NOT NULL AUTO_INCREMENT,
    name        varchar(255) NOT NULL,
    category_id int(11)      NOT NULL,
    sorting     int(11)      NOT NULL,
    parent_id   int(11) DEFAULT NULL,
    description text    DEFAULT NULL,
    hidden      text    DEFAULT NULL,
    params      text    DEFAULT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `builder_items_categories` FOREIGN KEY (category_id) REFERENCES `builder_categories` (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `builder_items_parent` FOREIGN KEY (parent_id) REFERENCES `builder_items` (id) ON DELETE CASCADE ON UPDATE CASCADE
)
    ENGINE = InnoDB
    DEFAULT CHARSET = utf8
    COLLATE = utf8_general_ci;