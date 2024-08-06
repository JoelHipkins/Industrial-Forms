<?php

	class userData {
		function __construct() {
			$self = $this;
			if (isset($_SESSION['logged']) && $_SESSION['logged'] == true ) {

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
				
					if ($result = @$connection->query(sprintf("SELECT * FROM users WHERE id='".$_SESSION['user_id']."'")))
					{
						$response = $result->fetch_assoc();
						$self->result['id'] = $response['id'];
						$self->result['user'] = $response['user'];
						$self->result['fullname'] = $response['fullname'];
						$self->result['level'] = $response['level'];
						
					} else {
						$self->status = false;
						$self->error = "Nie udało sie pobrać danych z bazy";
					}
					
					$connection->close();
				}
			} else {
				$_SESSION['logged'] = false;
				$this->status = false;
				$this->error = "Zaloguj się!";
			}
	    }
	}
?>