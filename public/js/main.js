import { jsPDF } from "https://cdn.skypack.dev/jspdf";
import jspdfAutotable from 'https://cdn.skypack.dev/jspdf-autotable';

const doc = new jsPDF();

doc.text("Hello world!", 10, 10);
doc.save("a4.pdf");

// Get the modal
var modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById("myImg");
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
img.onclick = function(){
  modal.style.display = "block";
  modalImg.src = this.src;
  captionText.innerHTML = this.alt;
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}