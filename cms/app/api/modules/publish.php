<?php

	class publish {
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

					if ($result = @$connection->query(sprintf("SELECT * FROM gallery WHERE 1 ORDER BY `ord` ASC")))
					{
						$response = null;			
						for($i = 0; $response[$i] = $result->fetch_assoc(); $i++) {
							$responseGallery = null;	
							if ($result2 = @$connection->query(sprintf("SELECT * FROM images WHERE gallery_id=".$response[$i]['id']."")))
							{			
								for($j = 0; $responseGallery[$j] = $result2->fetch_assoc(); $j++) ;
								array_pop($responseGallery);
								$response[$i]['gallery'] = $responseGallery;
								$this->error = null;
								
							} else {
								$self->status = true;
								$self->error = "Nie udało sie pobrać danych z bazy";
							}
						};
						array_pop($response);
						$self->result['portfolio'] = $response;
						$this->error = null;
						
					} else {
						$self->status = true;
						$self->error = "Nie udało sie pobrać danych z bazy";
					}

					if ($result = @$connection->query(sprintf("SELECT * FROM categories WHERE 1 ORDER BY `ord` ASC")))
					{
						$response = null;				
						for($i = 0; $response[$i] = $result->fetch_assoc(); $i++) ;
						array_pop($response);
						$self->result['categories'] = $response;
						$this->error = null;
						
					} else {
						$self->status = true;
						$self->error = "Nie udało sie pobrać danych z bazy";
					}

					if ($result = @$connection->query(sprintf("SELECT * FROM products WHERE 1 ORDER BY `ord` ASC")))
					{
						$response = null;			
						for($i = 0; $response[$i] = $result->fetch_assoc(); $i++) {
							$responseGallery = null;	
							if ($result2 = @$connection->query(sprintf("SELECT * FROM images WHERE news_id=".$response[$i]['id']."")))
							{			
								for($j = 0; $responseGallery[$j] = $result2->fetch_assoc(); $j++) ;
								array_pop($responseGallery);
								$response[$i]['gallery'] = $responseGallery;
								$this->error = null;
								
							} else {
								$self->status = true;
								$self->error = "Nie udało sie pobrać danych z bazy";
							}
						};
						array_pop($response);
						$self->result['products'] = $response;
						$this->error = null;
						
					} else {
						$self->status = true;
						$self->error = "Nie udało sie pobrać danych z bazy";
					}
				}

				$connection->close();
			} else {
				$_SESSION['logged'] = false;
				$this->status = false;
				$this->error = "Log in first!";
			}
	    }
	}
?>