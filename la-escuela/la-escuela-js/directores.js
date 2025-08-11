// Datos detallados de los directores
        const directorsData = {
            'carlos-mendoza': {
                name: 'Dr. Carlos Mendoza Rivera',
                position: 'Director Principal',
                faculty: 'Escuela de Posgrado',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
                details: `
                    <h3>Formación Académica</h3>
                    <p>• Doctorado en Educación Superior - Universidad Nacional Mayor de San Marcos</p>
                    <p>• Maestría en Gestión Universitaria - Universidad del Pacífico</p>
                    <p>• Licenciado en Administración - Universidad Nacional del Callao</p>
                    
                    <h3>Experiencia Profesional</h3>
                    <p>Con más de 15 años de experiencia en gestión académica, ha liderado importantes proyectos de innovación educativa y desarrollo de programas de posgrado. Su visión estratégica ha contribuido significativamente al crecimiento de la Escuela de Posgrado.</p>
                    
                    <h3>Contacto</h3>
                    <p>📧 cmendoza@unac.edu.pe</p>
                    <p>📞 (01) 429-6101 ext. 101</p>
                `
            },
            'ana-garcia': {
                name: 'Dr. Ana García López',
                position: 'Directora',
                faculty: 'Facultad de Ingeniería Industrial',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
                details: `
                    <h3>Formación Académica</h3>
                    <p>• Doctorado en Ingeniería Industrial - Universidad Nacional de Ingeniería</p>
                    <p>• Maestría en Gestión de la Producción - PUCP</p>
                    <p>• Ingeniera Industrial - Universidad Nacional del Callao</p>
                    
                    <h3>Áreas de Especialización</h3>
                    <p>• Sistemas de Gestión de Calidad ISO 9001</p>
                    <p>• Lean Manufacturing y Six Sigma</p>
                    <p>• Optimización de Procesos Productivos</p>
                    
                    <h3>Investigación</h3>
                    <p>Ha publicado más de 20 artículos en revistas indexadas sobre optimización industrial y ha dirigido proyectos de investigación aplicada en colaboración con el sector industrial peruano.</p>
                    
                    <h3>Contacto</h3>
                    <p>📧 agarcia@unac.edu.pe</p>
                    <p>📞 (01) 429-6102 ext. 201</p>
                `
            },
            'roberto-silva': {
                name: 'Ing. Roberto Silva Paredes',
                position: 'Director',
                faculty: 'Facultad de Ingeniería Mecánica',
                image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face',
                details: `
                    <h3>Formación Académica</h3>
                    <p>• Maestría en Ingeniería Mecánica - Universidad Nacional de Ingeniería</p>
                    <p>• Especialización en Automatización Industrial - Universidad Politécnica de Valencia</p>
                    <p>• Ingeniero Mecánico - Universidad Nacional del Callao</p>
                    
                    <h3>Experiencia Profesional</h3>
                    <p>Más de 18 años de experiencia en diseño mecánico y automatización. Ha liderado proyectos de modernización industrial y es consultor en implementación de tecnologías Industry 4.0.</p>
                    
                    <h3>Investigación y Proyectos</h3>
                    <p>• Desarrollo de sistemas automatizados para la industria pesquera</p>
                    <p>• Investigación en materiales compuestos para aplicaciones marinas</p>
                    <p>• Proyectos de eficiencia energética en procesos industriales</p>
                    
                    <h3>Contacto</h3>
                    <p>📧 rsilva@unac.edu.pe</p>
                    <p>📞 (01) 429-6103 ext. 301</p>
                `
            },
            'maria-torres': {
                name: 'Dra. María Torres Castillo',
                position: 'Directora',
                faculty: 'Facultad de Ciencias Naturales',
                image: 'https://images.unsplash.com/photo-1494790108755-2616b612b107?w=300&h=300&fit=crop&crop=face',
                details: `
                    <h3>Formación Académica</h3>
                    <p>• Doctorado en Biología - Universidad Nacional Mayor de San Marcos</p>
                    <p>• Maestría en Conservación y Gestión del Medio Ambiente - Universidad Ricardo Palma</p>
                    <p>• Bióloga - Universidad Nacional del Callao</p>
                    
                    <h3>Líneas de Investigación</h3>
                    <p>• Biodiversidad marina del litoral peruano</p>
                    <p>• Conservación de ecosistemas costeros</p>
                    <p>• Impacto del cambio climático en especies endémicas</p>
                    
                    <h3>Reconocimientos</h3>
                    <p>Investigadora REGINA nivel IV del CONCYTEC. Ha publicado más de 35 artículos científicos en revistas de alto impacto y es miembro del Comité Científico Nacional de Biodiversidad.</p>
                    
                    <h3>Contacto</h3>
                    <p>📧 mtorres@unac.edu.pe</p>
                    <p>📞 (01) 429-6104 ext. 401</p>
                `
            },
            'luis-ramirez': {
                name: 'Dr. Luis Ramírez Vega',
                position: 'Director',
                faculty: 'Facultad de Ciencias Administrativas',
                image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=300&h=300&fit=crop&crop=face',
                details: `
                    <h3>Formación Académica</h3>
                    <p>• Doctorado en Administración - Universidad Nacional Federico Villarreal</p>
                    <p>• MBA - ESAN Graduate School of Business</p>
                    <p>• Licenciado en Administración - Universidad Nacional del Callao</p>
                    
                    <h3>Experiencia Empresarial</h3>
                    <p>Ex Gerente General de importantes empresas del sector logístico portuario. Consultor empresarial especializado en transformación digital y gestión del cambio organizacional.</p>
                    
                    <h3>Áreas de Expertise</h3>
                    <p>• Gestión estratégica empresarial</p>
                    <p>• Liderazgo y desarrollo organizacional</p>
                    <p>• Comercio internacional y logística</p>
                    
                    <h3>Contacto</h3>
                    <p>📧 lramirez@unac.edu.pe</p>
                    <p>📞 (01) 429-6105 ext. 501</p>
                `
            },
            'patricia-morales': {
                name: 'Dr. Patricia Morales Sánchez',
                position: 'Directora',
                faculty: 'Facultad de Ciencias de la Salud',
                image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face',
                details: `
                    <h3>Formación Académica</h3>
                    <p>• Doctorado en Salud Pública - Universidad Peruana Cayetano Heredia</p>
                    <p>• Maestría en Epidemiología - Universidad Nacional Mayor de San Marcos</p>
                    <p>• Médico Cirujano - Universidad Nacional del Callao</p>
                    
                    <h3>Especialización</h3>
                    <p>• Medicina preventiva y salud comunitaria</p>
                    <p>• Epidemiología de enfermedades transmisibles</p>
                    <p>• Gestión de sistemas de salud</p>
                    
                    <h3>Investigación</h3>
                    <p>Directora de múltiples proyectos de investigación en salud pública financiados por CONCYTEC. Ha participado como consultora de la OPS/OMS en programas de prevención.</p>
                    
                    <h3>Contacto</h3>
                    <p>📧 pmorales@unac.edu.pe</p>
                    <p>📞 (01) 429-6106 ext. 601</p>
                `
            },
            'jose-fernandez': {
                name: 'Ing. José Fernández Cruz',
                position: 'Director',
                faculty: 'Facultad de Ingeniería Eléctrica',
                image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=300&h=300&fit=crop&crop=face',
                details: `
                    <h3>Formación Académica</h3>
                    <p>• Maestría en Energías Renovables - Universidad Nacional de Ingeniería</p>
                    <p>• Especialización en Smart Grids - Universidad Politécnica de Madrid</p>
                    <p>• Ingeniero Eléctrico - Universidad Nacional del Callao</p>
                    
                    <h3>Experiencia Profesional</h3>
                    <p>Más de 20 años en el sector energético peruano. Ha liderado proyectos de electrificación rural y sistemas de energía renovable a nivel nacional.</p>
                    
                    <h3>Proyectos Destacados</h3>
                    <p>• Implementación de parques eólicos en la costa peruana</p>
                    <p>• Desarrollo de microrredes inteligentes para comunidades rurales</p>
                    <p>• Consultoría en eficiencia energética para el sector industrial</p>
                    
                    <h3>Contacto</h3>
                    <p>📧 jfernandez@unac.edu.pe</p>
                    <p>📞 (01) 429-6107 ext. 701</p>
                `
            },
            'carmen-ruiz': {
                name: 'Dra. Carmen Ruiz Delgado',
                position: 'Directora',
                faculty: 'Facultad de Ciencias Contables',
                image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face',
                details: `
                    <h3>Formación Académica</h3>
                    <p>• Doctorado en Ciencias Contables y Empresariales - Universidad Nacional Mayor de San Marcos</p>
                    <p>• Maestría en Auditoría Integral - Universidad del Pacífico</p>
                    <p>• Contadora Pública - Universidad Nacional del Callao</p>
                    
                    <h3>Certificaciones Profesionales</h3>
                    <p>• Certificación Internacional en Auditoría (CIA)</p>
                    <p>• Certified Public Accountant (CPA)</p>
                    <p>• Especialista en Normas Internacionales de Información Financiera (NIIF)</p>
                    
                    <h3>Experiencia</h3>
                    <p>Socia fundadora de importante firma de auditoría. Ha asesorado a empresas del sector minero, pesquero y de servicios financieros en procesos de restructuración y compliance.</p>
                    
                    <h3>Contacto</h3>
                    <p>📧 cruiz@unac.edu.pe</p>
                    <p>📞 (01) 429-6108 ext. 801</p>
                `
            }
        };

        // Funciones de filtrado para directores
        function initializeDirectorsFilters() {
            const filterBtns = document.querySelectorAll('.directors-filter-btn');
            const directorCards = document.querySelectorAll('.director-card');

            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Remover clase active de todos los botones
                    filterBtns.forEach(b => b.classList.remove('active'));
                    // Agregar clase active al botón clickeado
                    btn.classList.add('active');

                    const filterValue = btn.getAttribute('data-filter');
                    
                    directorCards.forEach(card => {
                        if (filterValue === 'all') {
                            card.classList.remove('hidden');
                            card.classList.add('visible');
                        } else {
                            const categories = card.getAttribute('data-category').split(' ');
                            if (categories.includes(filterValue)) {
                                card.classList.remove('hidden');
                                card.classList.add('visible');
                            } else {
                                card.classList.add('hidden');
                                card.classList.remove('visible');
                            }
                        }
                    });
                });
            });
        }

        // Funciones del modal de directores
        function openDirectorModal(directorId) {
            const modal = document.getElementById('directorsModal');
            const data = directorsData[directorId];
            
            if (data) {
                document.getElementById('directorsModalImage').src = data.image;
                document.getElementById('directorsModalImage').alt = data.name;
                document.getElementById('directorsModalName').textContent = data.name;
                document.getElementById('directorsModalPosition').textContent = data.position;
                document.getElementById('directorsModalFaculty').textContent = data.faculty;
                document.getElementById('directorsModalDetails').innerHTML = data.details;
                
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        }

        function closeDirectorModal() {
            const modal = document.getElementById('directorsModal');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Cerrar modal al hacer click fuera del contenido
        window.addEventListener('click', function(event) {
            const modal = document.getElementById('directorsModal');
            if (event.target === modal) {
                closeDirectorModal();
            }
        });

        // Cerrar modal con tecla Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeDirectorModal();
            }
        });

        // Inicializar filtros cuando se carga la página
        document.addEventListener('DOMContentLoaded', function() {
            initializeDirectorsFilters();
            
            // Agregar eventos de click a los botones de contacto
            const contactBtns = document.querySelectorAll('.contact-btn');
            contactBtns.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation(); // Evitar que se abra el modal
                    if (this.classList.contains('email')) {
                        // Aquí puedes agregar la lógica para abrir el cliente de email
                        console.log('Abrir email');
                    } else if (this.classList.contains('phone')) {
                        // Aquí puedes agregar la lógica para realizar llamada
                        console.log('Realizar llamada');
                    }
                });
            });
        });