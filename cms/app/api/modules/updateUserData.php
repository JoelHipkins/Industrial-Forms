<?php

	class updateData {
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
				$user = $params['user'];
				$fullname = $params['fullname'];
				$id = $params['id'];
				
				if ($result = @$connection->query(
				sprintf("UPDATE `users` SET  `user` =  '%s', `fullname` =  '%s' WHERE `id` ='%s';",
				mysqli_real_escape_string($connection,$user),
				mysqli_real_escape_string($connection,$fullname),
				mysqli_real_escape_string($connection,$id))))
				{
					$self->error = null;
				} else {
					$self->error = "Aktualizacja nie powiodła się";
				}
					
				$connection->close();
			}
	    }
	}
?>