<?php

	class login {
		function __construct($params) {
			$self = $this;
			if (isset($params['user']) && isset($params['password']) && $params['password'] != null && $params['password'] != '' && $params['user'] != null && $params['user'] != '') {

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
					$password = $params['password'];
				
					if ($result = @$connection->query(
					sprintf("SELECT * FROM users WHERE user='%s' AND password='%s'",
					mysqli_real_escape_string($connection,$user),
					mysqli_real_escape_string($connection,$password))))
					{
						$users = $result->num_rows;
						$user_data = $result->fetch_assoc();
						if($users>0)
						{
							$_SESSION['logged'] = true;
							$_SESSION['user_id'] = $user_data['id'];
							$self->status = true;
							$self->error = null;
							$result->free_result();
							
						} else {
							
							$self->status = false;
							$self->error = 'Nieprawidłowy login lub hasło!';
							
						}
						
					} else {
						$self->status = false;
						$self->error = "Nie udało sie pobrać danych z bazy";
					}
					
					$connection->close();
				}
			} else {
				$_SESSION['logged'] = false;
				$this->status = false;
				$this->error = "Podaj login oraz hasło";
			}
	    }
	}
?>