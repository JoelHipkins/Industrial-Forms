<?php

require_once("images.php");
require_once("imageResize.php");

	class moveUp {
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
					$prev_id = $params['prevId'];
					$table = $params['table'];

					if ($result = @$connection->query(
					sprintf("UPDATE `%s` SET  `ord` =  '0' WHERE `ord` ='%s';",
					mysqli_real_escape_string($connection,$table),
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

					if ($result = @$connection->query(
					sprintf("UPDATE `%s` SET  `ord` =  '%s' WHERE `ord` ='%s';",
					mysqli_real_escape_string($connection,$table),
					mysqli_real_escape_string($connection,$id),
					mysqli_real_escape_string($connection,$prev_id))))
					{
						$self->result = null;
						$self->status = true;
						$self->error = null;
					} else {
						$self->status = false;
						$self->result = null;
						$self->error = "Aktualizacja nie powiodła się";
					}

					if ($result = @$connection->query(
					sprintf("UPDATE `%s` SET  `ord` =  '%s' WHERE `ord` ='0';",
					mysqli_real_escape_string($connection,$table),
					mysqli_real_escape_string($connection,$prev_id))))
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

			} else {
				$_SESSION['logged'] = false;
				$this->status = false;
				$self->result = null;
				$this->error = "Zaloguj się!";
			}
	    }
	}
?>