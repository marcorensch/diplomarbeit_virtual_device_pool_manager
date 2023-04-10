CREATE TABLE IF NOT EXISTS `builder_items`
(
    id          int(11)      NOT NULL AUTO_INCREMENT,
    name        varchar(255) NOT NULL,
    category_id int(11)      NOT NULL,
    description text         NOT NULL,
    hidden      text         NOT NULL,
    sorting     int(11)      NOT NULL,
    parent_id   int(11)      NOT NULL,
    params      text         NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `builder_items_categories` FOREIGN KEY (category_id) REFERENCES `builder_categories` (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `builder_items_parent` FOREIGN KEY (parent_id) REFERENCES `builder_items` (id) ON DELETE CASCADE ON UPDATE CASCADE
)
    ENGINE = InnoDB
    DEFAULT CHARSET = utf8
    COLLATE = utf8_general_ci;