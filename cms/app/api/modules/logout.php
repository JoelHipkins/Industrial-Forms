<?php
	class logout {
		function __construct() {
			if (!session_unset()) {
				$this->status = false;
				$this->error = null;
			} else {
				$this->status = false;
				$this->error = "Wylogowanie nie powiodło się";
			}
	    }
	}
?>