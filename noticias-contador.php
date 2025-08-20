<?php
// noticias-contador.php
header('Content-Type: application/json');

$jsonFile = 'noticias.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Actualizar noticias destacadas (global)
    $input = json_decode(file_get_contents('php://input'), true);
    if (isset($input['action']) && $input['action'] === 'update_destacadas' && isset($input['destacadas']) && is_array($input['destacadas'])) {
        $data = json_decode(file_get_contents($jsonFile), true);
        $data['destacadas'] = $input['destacadas'];
        file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true, 'destacadas' => $data['destacadas']]);
        exit;
    }
    // Editar noticia por id
    if (isset($_POST['action']) && $_POST['action'] === 'edit_noticia' && isset($_POST['id'])) {
        $data = json_decode(file_get_contents($jsonFile), true);
        $id = intval($_POST['id']);
        foreach ($data['noticias'] as &$noticia) {
            if ($noticia['id'] === $id) {
                $noticia['titulo'] = isset($_POST['titulo']) ? $_POST['titulo'] : $noticia['titulo'];
                $noticia['fecha'] = isset($_POST['fecha']) ? $_POST['fecha'] : $noticia['fecha'];
                $noticia['contenido'] = isset($_POST['contenido']) ? $_POST['contenido'] : $noticia['contenido'];
                $noticia['contenidoExtendido'] = isset($_POST['contenido-extendido']) ? $_POST['contenido-extendido'] : $noticia['contenidoExtendido'];
                $noticia['creador'] = isset($_POST['creador']) ? $_POST['creador'] : $noticia['creador'];
                $noticia['categoria'] = isset($_POST['categoria']) ? $_POST['categoria'] : $noticia['categoria'];
                // Procesar nueva imagen si se envía
                if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
                    $tmpName = $_FILES['imagen']['tmp_name'];
                    $originalName = basename($_FILES['imagen']['name']);
                    $targetPath = 'img/' . $originalName;
                    $i = 1;
                    $base = pathinfo($originalName, PATHINFO_FILENAME);
                    $ext = pathinfo($originalName, PATHINFO_EXTENSION);
                    while (file_exists($targetPath)) {
                        $targetPath = 'img/' . $base . "_" . $i . "." . $ext;
                        $i++;
                    }
                    if (move_uploaded_file($tmpName, $targetPath)) {
                        $noticia['imagen'] = basename($targetPath);
                    }
                }
                break;
            }
        }
        file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true, 'imagen' => isset($noticia['imagen']) ? $noticia['imagen'] : null]);
        exit;
    }
    // Eliminar noticia por id
    if (isset($_POST['action']) && $_POST['action'] === 'delete_noticia' && isset($_POST['id'])) {
        $data = json_decode(file_get_contents($jsonFile), true);
        $id = intval($_POST['id']);
        $noticias = $data['noticias'];
        $nuevasNoticias = array_filter($noticias, function($n) use ($id) {
            return $n['id'] !== $id;
        });
        $data['noticias'] = array_values($nuevasNoticias);
        file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true]);
        exit;
    }

    // Guardar nueva noticia con imagen subida
    if (isset($_POST['action']) && $_POST['action'] === 'add_noticia') {
        $data = json_decode(file_get_contents($jsonFile), true);
        // Generar nuevo id
        $maxId = 0;
        if (isset($data['noticias']) && is_array($data['noticias'])) {
            foreach ($data['noticias'] as $item) {
                if (isset($item['id']) && $item['id'] > $maxId) $maxId = $item['id'];
            }
        }
        $id = $maxId + 1;
        // Procesar imagen subida
        $imagenNombre = '';
        if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
            $tmpName = $_FILES['imagen']['tmp_name'];
            $originalName = basename($_FILES['imagen']['name']);
            $targetPath = 'img/' . $originalName;
            // Si ya existe, renombrar
            $i = 1;
            $base = pathinfo($originalName, PATHINFO_FILENAME);
            $ext = pathinfo($originalName, PATHINFO_EXTENSION);
            while (file_exists($targetPath)) {
                $targetPath = 'img/' . $base . "_" . $i . "." . $ext;
                $i++;
            }
            if (move_uploaded_file($tmpName, $targetPath)) {
                $imagenNombre = basename($targetPath);
            }
        }
        // Construir noticia con 'id' al inicio
        $noticia = [
        'id' => $id,
        'titulo' => isset($_POST['titulo']) ? $_POST['titulo'] : '',
        'fecha' => isset($_POST['fecha']) ? $_POST['fecha'] : '',
        'contenido' => isset($_POST['contenido']) ? $_POST['contenido'] : '',
        'contenidoExtendido' => isset($_POST['contenido-extendido']) ? $_POST['contenido-extendido'] : '',
        'imagen' => $imagenNombre,
        'creador' => isset($_POST['creador']) ? $_POST['creador'] : '',
        'categoria' => isset($_POST['categoria']) ? $_POST['categoria'] : '',
        'clics' => 0
        ];
        $data['noticias'][] = $noticia;
        file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true, 'noticia' => $noticia]);
        exit;
    }
    // Si la acción es actualizar categorías
    if (isset($input['action']) && $input['action'] === 'update_categorias' && isset($input['categorias']) && is_array($input['categorias'])) {
        $data = json_decode(file_get_contents($jsonFile), true);
        $data['categorias'] = $input['categorias'];
        file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true, 'categorias' => $data['categorias']]);
        exit;
    }
    // Si la acción es aumentar clics
    if (!isset($input['id'])) {
        echo json_encode(['success' => false, 'error' => 'ID no proporcionado']);
        exit;
    }
    $id = intval($input['id']);
    // Leer el JSON como objeto con 'noticias' y 'eventos'
    $data = json_decode(file_get_contents($jsonFile), true);
    $encontrada = false;
    if (isset($data['noticias']) && is_array($data['noticias'])) {
        foreach ($data['noticias'] as &$noticia) {
            if ($noticia['id'] === $id) {
                if (!isset($noticia['clics'])) {
                    $noticia['clics'] = 0;
                }
                $noticia['clics']++;
                $encontrada = true;
                break;
            }
        }
    }
    if ($encontrada) {
        file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Noticia no encontrada']);
    }
    exit;
}

// Si no es POST, mostrar error
http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Método no permitido']);
