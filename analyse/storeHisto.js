		function storeHisto() {
			var request = document.getElementById("requestText").firstChild.data;
			var histo = localStorage.getItem("SXThisto");
			if (!histo) histo = "";
			request = request.trim();
			var tail = (request.substr(-1,1) == ";")? "\n" : ";\n";
			histo = request + tail + histo;
			localStorage.setItem("SXThisto", histo);
		}
