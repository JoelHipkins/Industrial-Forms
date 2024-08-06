<?php

	class delete {
		function __construct($params) {
			$self = $this;
			if (isset($_SESSION['logged']) && $_SESSION['logged'] == true ) {

				require_once("modules/connect.php");

				$connection = @new mysqli($host, $db_user, $db_password, $db_name);

				@$connection->query(sprintf("set names 'utf8'"));
				@$connection->query(sprintf("SET CHARACTER_SET utf8_general_ci"));
	
				if ($connection->connect_errno!=0)
				{
					$self->result = null;
					$self->status = false;
					$self->error = "Błąd połączenia z bazą danych";
				}
				else
				{
					$id = $params['id'];
					$table = $params['table'];

					if ($result = @$connection->query(sprintf("DELETE FROM `%s` WHERE id= '%s'",
					mysqli_real_escape_string($connection,$table),
					mysqli_real_escape_string($connection,$id))))
					{
						$self->result = null;
						$self->status = true;
						$self->error = null;
						
					} else {
						$self->result = null;
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