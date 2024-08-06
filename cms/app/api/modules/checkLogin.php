<?php
	class checkLogin {
		function __construct() {
	        if ((isset($_SESSION['logged'])) && ($_SESSION['logged']==true))
			{
				$this->status = true;
			} else {
				$this->status = false;
			}
	    }
	}
?>