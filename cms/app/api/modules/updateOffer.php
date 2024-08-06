<?php

require_once("images.php");
require_once("imageResize.php");

	class updateOffer {
		function __construct($params) {

			$self = $this;
			if (isset($_SESSION['logged']) && $_SESSION['logged'] == true ) {

				require_once("modules/connect.php");

				$connection = @new mysqli($host, $db_user, $db_password, $db_name);

				@$connection->query(sprintf("set names 'utf8'"));
				@$connection->query(sprintf("SET CHARACTER_SET utf8_general_ci"));
		
				if ($connection->connect_errno!=0)
				{
					$self->status = false;
					$self->result = null;
					$self->error = "Błąd połączenia z bazą danych";
				}
				else
				{
					$id = $params['id'];
					$title = $params['title'];
					$description = str_replace('&quot;', '"', $params['description']);
					$in_progress = $params['in_progress'];
					$offer_id = $params['offer_id'];
					$measurement = $params['measurement'];
					$price = $params['price'];
					$price_full = $params['price_full'];
					$image = imageUpload('file');
					$today = $params['date'];

					if ($image['error'] == NULL) {
						$img = htmlspecialchars($image['photo'], ENT_QUOTES,'UTF-8');

						if ($result = @$connection->query(
						sprintf("UPDATE `offer` SET  `date` =  '%s', `title` =  '%s', `description` =  '%s', `offer_id` =  '%s', `in_progress` =  '%s', `measurement` =  '%s', `price` =  '%s', `price_full` =  '%s', `image` = '%s' WHERE `id` ='%s';",
						mysqli_real_escape_string($connection,$today),
						mysqli_real_escape_string($connection,$title),
						mysqli_real_escape_string($connection,$description),
						mysqli_real_escape_string($connection,$offer_id),
						mysqli_real_escape_string($connection,$in_progress),
						mysqli_real_escape_string($connection,$measurement),
						mysqli_real_escape_string($connection,$price),
						mysqli_real_escape_string($connection,$price_full),
						mysqli_real_escape_string($connection,$img),
						mysqli_real_escape_string($connection,$id))))
						{
							$self->result = null;
							$self->status = true;
							$self->error = null;
						} else {
							$self->status = false;
							$self->result = null;
							$self->error = "Aktualizacja nie powiodła się";
						}
							
						$connection->close();
					} else {
						if ($result = @$connection->query(
						sprintf("UPDATE `offer` SET  `date` =  '%s', `title` =  '%s', `description` =  '%s', `offer_id` =  '%s', `in_progress` =  '%s', `measurement` =  '%s', `price` =  '%s', `price_full` =  '%s' WHERE `id` ='%s';",
						mysqli_real_escape_string($connection,$today),
						mysqli_real_escape_string($connection,$title),
						mysqli_real_escape_string($connection,$description),
						mysqli_real_escape_string($connection,$offer_id),
						mysqli_real_escape_string($connection,$in_progress),
						mysqli_real_escape_string($connection,$measurement),
						mysqli_real_escape_string($connection,$price),
						mysqli_real_escape_string($connection,$price_full),
						mysqli_real_escape_string($connection,$id))))
						{
							$self->result = null;
							$self->status = true;
							$self->error = null;
						} else {
							$self->status = false;
							$self->result = null;
							$self->error = "Aktualizacja nie powiodła się";
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