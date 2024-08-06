<?php

ini_set('display_errors',1);
error_reporting(E_ALL);

require_once("images.php");
require_once("imageResize.php");

	class addOffer {
		function __construct($params) {
			$self = $this;
			if (isset($_SESSION['logged']) && $_SESSION['logged'] == true ) {

				require_once("modules/connect.php");

				$connection = @new mysqli($host, $db_user, $db_password, $db_name);

				@$connection->query(sprintf("set names 'utf8'"));
				@$connection->query(sprintf("SET CHARACTER_SET 'utf8_general_ci'"));
		
				if ($connection->connect_errno!=0)
				{
					$self->status = true;
					$self->result = null;
					$self->error = "Błąd połączenia z bazą danych";
				}
				else
				{
					$title = $params['title'];
					$description = str_replace('&quot;', '"', $params['description']);
					$in_progress = $params['in_progress'];
					$offer_id = $params['offer_id'];
					$measurement = $params['measurement'];
					$price = $params['price'];
					$price_full = $params['price_full'];
					$image = imageUpload('file');
					$today = date('d.m.Y');

					if ($image['error'] == NULL) {
						$img = htmlspecialchars($image['photo'], ENT_QUOTES,'UTF-8');

						if ($result = @$connection->query(
						sprintf("INSERT INTO `offer` (`date`, `title`, `description`, `offer_id`, `in_progress`, `measurement`, `price`, `price_full`, `image`) VALUES ('%s','%s','%s','%s','%s','%s','%s','%s','%s')",
						mysqli_real_escape_string($connection,$today),
						mysqli_real_escape_string($connection,$title),
						mysqli_real_escape_string($connection,$description),
						mysqli_real_escape_string($connection,$offer_id),
						mysqli_real_escape_string($connection,$in_progress),
						mysqli_real_escape_string($connection,$measurement),
						mysqli_real_escape_string($connection,$price),
						mysqli_real_escape_string($connection,$price_full),
						mysqli_real_escape_string($connection,$img))))
						{
							$last_id = $connection->insert_id;
							$res = @$connection->query(sprintf("UPDATE `offer` SET `ord` = '".$last_id."' WHERE `id` ='".$last_id."';"));
							$self->result = null;
							$self->status = true;
							$self->error = null;
						} else {
							$self->status = true;
							$self->result = null;
							$self->error = "Nie udało sie dodać";
						}
							
						$connection->close();
					} else {

						$img = "";

						if ($result = $connection->query(
						sprintf("INSERT INTO `offer` (`date`, `title`, `description`, `offer_id`, `in_progress`, `measurement`, `price`, `price_full`, `image`) VALUES ('%s','%s','%s','%s','%s','%s','%s','%s','%s')",
						mysqli_real_escape_string($connection,$today),
						mysqli_real_escape_string($connection,$title),
						mysqli_real_escape_string($connection,$description),
						mysqli_real_escape_string($connection,$offer_id),
						mysqli_real_escape_string($connection,$in_progress),
						mysqli_real_escape_string($connection,$measurement),
						mysqli_real_escape_string($connection,$price),
						mysqli_real_escape_string($connection,$price_full),
						mysqli_real_escape_string($connection,$img))))
						{
							$last_id = $connection->insert_id;
							$res = @$connection->query(sprintf("UPDATE `offer` SET `ord` = '".$last_id."' WHERE `id` ='".$last_id."';"));
							$self->result = null;
							$self->status = true;
							$self->error = null;
						} else {
							$self->status = true;
							$self->result = null;
							$self->error = "Nie udało sie dodać";
						}
							
						$connection->close();
					}
				}
			} else {
				$_SESSION['logged'] = false;
				$this->status = false;
				$self->result = null;
				$this->error = "Zaloguj się!";
			}
	    }
	}
?>