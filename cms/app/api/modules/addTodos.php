<?php

	class addTodos {
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
					$description = $params['description'];
					
					if ($result = @$connection->query(
					sprintf("INSERT INTO `todos`(`description`) VALUES ('%s')",
					mysqli_real_escape_string($connection,$description))))
					{
						$self->result = null;
						$self->status = true;
						$self->error = null;
					} else {
						$self->status = false;
						$self->result = null;
						$self->error = "Nie udało sie dodać";
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