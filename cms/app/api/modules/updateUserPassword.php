<?php

	class updatePassword {
		function __construct($params) {
			$self = $this;

			require_once("modules/connect.php");

			$connection = @new mysqli($host, $db_user, $db_password, $db_name);

			@$connection->query(sprintf("set names 'utf8'"));
			@$connection->query(sprintf("SET CHARACTER_SET utf8_general_ci"));
	
			if ($connection->connect_errno!=0)
			{
				$self->status = false;
				$self->error = "Błąd połączenia z bazą danych";
			}
			else
			{

				$id = $params['id'];
				$oldPassword = $params['oldPassword'];
				
				if ($result = @$connection->query(
				sprintf("SELECT * FROM users WHERE id='%s' AND password='%s'",
				mysqli_real_escape_string($connection,$id),
				mysqli_real_escape_string($connection,$oldPassword))))
				{
					$users = $result->num_rows;
					$user_data = $result->fetch_assoc();
					if($users>0)
					{

						$newPassword = $params['newPassword'];
						$id = $params['id'];
						
						if ($result2 = @$connection->query(
						sprintf("UPDATE `users` SET  `password` =  '%s' WHERE `id` ='%s';",
						mysqli_real_escape_string($connection,$newPassword),
						mysqli_real_escape_string($connection,$id))))
						{
							$self->error = null;
						} else {
							$self->error = "Aktualizacja nie powiodła się";
						}
							
					} else {
							
						$self->status = false;
						$self->error = 'Nieprawidłowe hasło!';
							
					}
						
				} else {
					$self->status = false;
					$self->error = "Nie udało sie pobrać danych z bazy";
				}
					
				$connection->close();
			}
	    }
	}
?>