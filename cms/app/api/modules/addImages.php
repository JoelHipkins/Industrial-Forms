<?php

require_once("images.php");
require_once("imageResize.php");

	class addImages {
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

					for ($i=0; $i < count($_FILES); $i++) { 

						$image = imageUpload("file-{$i}");

						if ($image['error'] == NULL) {
							$img = htmlspecialchars($image['photo'], ENT_QUOTES,'UTF-8');
							$thumb = htmlspecialchars($image['thumb'], ENT_QUOTES,'UTF-8');

							if ($result = @$connection->query(
							sprintf("INSERT INTO `images` (`gallery_id`, `path`, `thumb`) VALUES ('%s','%s','%s')",
							mysqli_real_escape_string($connection,$id),
							mysqli_real_escape_string($connection,$img),
							mysqli_real_escape_string($connection,$thumb))))
							{
								$self->result = null;
								$self->status = true;
								$self->error = null;
							} else {
								$self->status = false;
								$self->result = mysqli_error($connection);
								$self->error = "Nie udało sie dodać";
							}
								
						} else {
							$self->status = false;
							$self->result = null;
							$self->error = "Nie udało się zapisać plików";
						}
					}

					$connection->close();
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