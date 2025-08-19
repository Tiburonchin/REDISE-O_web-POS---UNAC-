
// Acordeón exclusivo: solo uno abierto a la vez
document.addEventListener('DOMContentLoaded', function() {
	const accordions = document.querySelectorAll('.calidad-acordeones details.accordion-item');
	accordions.forEach((item) => {
		item.addEventListener('toggle', function() {
			if (item.open) {
				accordions.forEach((other) => {
					if (other !== item) other.open = false;
				});
			}
		});
	});
});
