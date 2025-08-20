

// Lógica para que solo un <details> esté abierto a la vez (acordeón exclusivo)
document.addEventListener('DOMContentLoaded', function () {
	const accordions = document.querySelectorAll('.accordion-transparencia details.accordion-item');
	accordions.forEach((item) => {
		item.addEventListener('toggle', function () {
			if (item.open) {
				accordions.forEach((other) => {
					if (other !== item) other.open = false;
				});
			}
		});
	});
});
