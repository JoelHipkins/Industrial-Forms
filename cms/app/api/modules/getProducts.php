<?php

	class getProducts {
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
				
					if ($result = @$connection->query(sprintf("SELECT * FROM products WHERE 1 ORDER BY `ord` ASC")))
					{

						for($i = 0; $response[$i] = $result->fetch_assoc(); $i++) ;
						array_pop($response);
						$self->result = $response;
						$this->error = null;
						
					} else {
						$self->status = false;
						$self->error = "Nie udało sie pobrać danych z bazy";
						$self->result = null;
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