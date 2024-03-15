import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';

import '../assets/BookMark.css'; // 스타일시트 임포트
import FinderIcon from '../assets/imgs/finderIcon.png';

const BookMark = () => {
    const [nodes, setNodes] = useState([]);
    const [bookmarkName, setBookmarkName] = useState('');
    const [bookmarkUrl, setBookmarkUrl] = useState('');
    const [folderName, setFolderName] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [selectedPath, setSelectedPath] = useState([]);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, selectedNodeId: null });
    const [editingNodeId, setEditingNodeId] = useState(null);
    const [editingNodeName, setEditingNodeName] = useState("");


    // 로컬 스토리지에서 북마크 데이터 불러오기
    useEffect(() => {
        const savedNodes = localStorage.getItem('bookmarks');
        if (savedNodes) {
            setNodes(JSON.parse(savedNodes));
        }
    }, []);

    // 로컬 스토리지에 북마크 데이터 저장하기
    useEffect(() => {
        if (nodes.length > 0) {
            localStorage.setItem('bookmarks', JSON.stringify(nodes));
        }
    }, [nodes]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // contextMenu가 보이는 경우, 이를 숨깁니다.
            if (contextMenu.visible) {
                setContextMenu({ ...contextMenu, visible: false });
            }
    
            // 클릭된 요소가 우측 패널의 일부인지 확인합니다.
            const rightPanel = document.querySelector('.right-panel');
            if (rightPanel && rightPanel.contains(event.target)) {
                // 클릭된 요소가 node-container 내부인지 확인합니다.
                const isNodeContainerClick = event.target.closest('.node-container');
    
                // node-container 내부가 아니라면, selectedPath를 초기화합니다.
                if (!isNodeContainerClick) {
                    setSelectedPath([]); // 선택된 폴더의 포커스 해제
                }
            }
        };
    
        // 클릭 이벤트 리스너 등록
        document.addEventListener('click', handleClickOutside);
    
        // 클린업 함수에서 이벤트 리스너 제거
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [contextMenu]);    

    const addFolder = () => {
        if (!folderName.trim()) {
            // 폴더 이름이 비어 있는 경우, 모달을 띄워 사용자에게 알립니다.
            handleOpenModal('폴더 이름을 입력해주세요.');
            return false;
        }
    
        const newFolder = {
            id: Date.now(),
            name: folderName,
            type: 'folder',
            children: [],
            parentId: selectedPath[selectedPath.length - 1] || null, // 마지막 선택된 폴더를 부모로 설정
        };
    
        if (newFolder.parentId) {
            // 선택된 폴더에 새 폴더를 추가합니다.
            setNodes(addNodeToFolder(nodes, newFolder.parentId, newFolder));
        } else {
            // 최상위 레벨에 새 폴더를 추가합니다.
            setNodes([...nodes, newFolder]);
        }
        setFolderName('');
    };    

    const openFinder = () => {
        window.electron.send('open-link-external', '파일 탐색기');
    }

    const addBookmark = () => {
        if (!bookmarkName.trim() || !bookmarkUrl.trim()) {
            handleOpenModal('북마크 이름과 URL을 모두 입력해주세요.');
            return;
        }
    
        let formattedUrl = bookmarkUrl;
        // URL이 http:// 또는 https://로 시작하지 않는 경우, http://를 추가합니다.
        if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
            handleOpenModal('주소가 올바르지 않습니다.');
            return false;
        }
    
        const newBookmark = {
            id: Date.now(),
            name: bookmarkName,
            url: formattedUrl, // bookmarkUrl 대신 formattedUrl 사용
            type: 'bookmark',
            parentId: selectedPath[selectedPath.length - 1] || null, // selectedPath의 마지막 요소를 부모 ID로 사용
        };
    
        if (newBookmark.parentId) {
            // 선택된 폴더(현재 선택된 경로의 마지막 요소)에 새 북마크를 추가합니다.
            const updatedNodes = addNodeToFolder(nodes, newBookmark.parentId, newBookmark);
            setNodes(updatedNodes);
        } else {
            // 최상위 레벨에 새 북마크를 추가합니다.
            setNodes([...nodes, newBookmark]);
        }
        setBookmarkName('');
        setBookmarkUrl('');
    };    

    // 선택된 폴더에 노드를 추가하는 재귀 함수
    const addNodeToFolder = (nodes, parentId, newNode) => {
        return nodes.map(node => {
            if (node.id === parentId) {
                // 부모 폴더를 찾았을 때 새 노드를 자식으로 추가합니다.
                return { ...node, children: [...node.children, newNode] };
            } else if (node.children) {
                // 하위 폴더도 검사합니다.
                return { ...node, children: addNodeToFolder(node.children, parentId, newNode) };
            }
            return node;
        });
    };    

    const handleContextMenu = (event, nodeId) => {
        event.preventDefault();
        event.stopPropagation();
        setContextMenu({
            visible: true,
            x: event.pageX,
            y: event.pageY,
            selectedNodeId: nodeId
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu({ ...contextMenu, visible: false });
    };

    const handleDeleteNode = () => {
        const { selectedNodeId } = contextMenu;
        deleteNode(selectedNodeId);
        handleCloseContextMenu();
    
        // 삭제된 노드가 selectedPath에 포함되어 있는지 확인하고, 필요한 경우 selectedPath 업데이트
        if (selectedPath.includes(selectedNodeId)) {
            const newPath = selectedPath.slice(0, selectedPath.indexOf(selectedNodeId));
            setSelectedPath(newPath);
        }
    };    

    const deleteNode = (nodeId) => {
        const deleteNodeRecursive = (nodes, nodeId) => {
            return nodes.reduce((acc, node) => {
                if (node.id === nodeId) {
                    // 노드를 삭제하지 않고 건너뛰어 현재 누적값을 반환
                    return acc;
                } else if (node.children) {
                    // 현재 노드에 자식이 있다면, 자식 목록에서도 검사하여 재귀적으로 삭제
                    const filteredChildren = deleteNodeRecursive(node.children, nodeId);
                    // 현재 노드를 누적값에 추가하되, 필터링된 자식 목록을 사용
                    return [...acc, {...node, children: filteredChildren}];
                }
                // 현재 노드가 삭제 대상이 아니고 자식도 없다면 그대로 누적값에 추가
                return [...acc, node];
            }, []);
        };
    
        // 전체 노드 목록에서 시작하여 삭제 대상 노드를 재귀적으로 제거
        setNodes(deleteNodeRecursive(nodes, nodeId));
    };    

    const renderContextMenu = () => {
        if (!contextMenu.visible) return null;
    
        return (
            <ul className="context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
                <li onClick={() => handleStartEditing(contextMenu.selectedNodeId)}>이름 변경</li>
                <li onClick={handleDeleteNode}>삭제</li>
            </ul>
        );
    };

    // 이름 변경 시작 처리
    const handleStartEditing = (nodeId) => {
        const node = findNodeById(nodes, nodeId);
        if (node) {
            setEditingNodeId(nodeId);
            setEditingNodeName(node.name);
            setContextMenu({ ...contextMenu, visible: false }); // 컨텍스트 메뉴 닫기
        }
    };

    const handleOpenModal = (content) => {
        setModalContent(content);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const openExternalLink = (url) => {
        window.electron.send('open-link-external', url);
    };

    const handleFolderClick = (folderId) => {
        // 현재 선택된 폴더의 인덱스를 찾습니다.
        const newPathIndex = selectedPath.indexOf(folderId);
    
        if (newPathIndex === -1) {
            // 새로운 폴더를 선택한 경우에는 기존의 selectedPath를 확인합니다.
            const currentFolder = findNodeById(nodes, folderId);
            if (currentFolder && currentFolder.parentId === null) {
                // 최상위 레벨에서 폴더를 선택한 경우, 이전 경로를 모두 제거하고 새 경로를 추가합니다.
                setSelectedPath([folderId]);
            } else {
                // 하위 레벨에서 폴더를 선택한 경우, 선택된 폴더의 하위 경로를 추가합니다.
                // 선택된 폴더의 부모까지의 경로를 찾아서 설정합니다.
                const newPath = [...findPathToNode(nodes, folderId), folderId];
                setSelectedPath(newPath);
            }
        } else {
            // 선택된 폴더가 이미 경로에 있다면, 그 폴더 이후의 경로를 잘라냅니다.
            setSelectedPath(selectedPath.slice(0, newPathIndex + 1));
        }
    };

    const findPathToNode = (nodes, id, path = []) => {
        for (const node of nodes) {
            if (node.id === id) return path;
            if (node.children) {
                const foundPath = findPathToNode(node.children, id, [...path, node.id]);
                if (foundPath) return foundPath;
            }
        }
        return null;
    };
    
    const renderColumnView = () => {
        // 모든 컬럼의 렌더링 결과를 담을 배열
        const columns = [];
    
        // 최상위 노드 컬럼 추가
        columns.push(
            renderNodes(
                nodes.filter(node => !node.parentId),
                []
            )
        );
    
        // 선택된 경로에 있는 각 폴더의 하위 노드 컬럼 추가
        selectedPath.forEach((folderId, index) => {
            const currentPath = selectedPath.slice(0, index + 1);
            const folder = findNodeById(nodes, folderId);
            if (folder) {
                columns.push(renderNodes(folder.children, currentPath));
            }
        });
    
        return (
            <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
                {columns}
            </div>
        );
    };
    
    const renderNodes = (nodes, currentPath) => {
        return (
            <div style={{ minWidth: '200px', borderRight: '1px solid #ccc', padding: '10px' }}>
                {nodes.map(node => (
                    <div key={node.id}
                        className="node-container"
                        onClick={() => node.type === 'folder' ? handleFolderClick(node.id) : openExternalLink(node.url)}
                        onContextMenu={(e) => handleContextMenu(e, node.id)}
                        style={{
                            backgroundColor: selectedPath.includes(node.id) ? '#007bff' : 'transparent',
                            color: selectedPath.includes(node.id) ? '#ffffff' : '#000',
                        }}
                    >
                        {editingNodeId === node.id ? (
                            <input
                                type="text"
                                value={editingNodeName}
                                onChange={(e) => setEditingNodeName(e.target.value)}
                                onBlur={() => updateNodeName(node.id, editingNodeName)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        updateNodeName(node.id, editingNodeName);
                                    }
                                }}
                                autoFocus
                            />
                        ) : (
                            <span className="node-label">
                                {node.type === 'folder' ? (selectedPath.includes(node.id) ? '📂' : '📁') : '🔗'} {node.name}
                            </span>
                        )}
                    </div>              
                ))}
            </div>
        );
    };    

    // 노드 이름 업데이트 로직
    const updateNodeName = (nodeId, newName) => {
        const updateRecursive = (nodes) => nodes.map((node) => {
            if (node.id === nodeId) {
                return { ...node, name: newName };
            } else if (node.children) {
                return { ...node, children: updateRecursive(node.children) }; // 재귀적으로 자식 노드도 업데이트
            }
            return node;
        });
    
        setNodes(updateRecursive(nodes));
        setEditingNodeId(null); // 편집 모드 종료
    };    
    
    const findNodeById = (nodes, id) => {
        // 주어진 ID에 해당하는 노드를 찾는 재귀 함수입니다.
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children) {
                const found = findNodeById(node.children, id);
                if (found) return found;
            }
        }
        return null;
    };        

    return (
        <div className="container">
            <div className="left-panel">
                <div>
                    <input
                        type="text"
                        value={folderName}
                        // 스타일 클래스 이름 적용
                        className="input"
                        onChange={(e) => setFolderName(e.target.value)}
                        placeholder="폴더 이름"
                    />
                    <button onClick={addFolder} className="button">폴더 추가</button>
                </div>

                <div>
                    <input
                        type="text"
                        value={bookmarkName}
                        className="input"
                        onChange={(e) => setBookmarkName(e.target.value)}
                        placeholder="북마크 이름"
                    />
                    <input
                        type="text"
                        value={bookmarkUrl}
                        className="input"
                        onChange={(e) => setBookmarkUrl(e.target.value)}
                        placeholder="북마크 URL"
                    />
                    <button onClick={addBookmark} className="button">북마크 추가</button>
                    <button onClick={openFinder} className="btn_finder">
                        <p>파일탐색기 / <img src={FinderIcon} alt="Finder" /></p>
                    </button>
                </div>
            </div>

            <div className="right-panel">
                {renderColumnView()}
                {renderContextMenu()}
            </div>
            <Modal show={showModal} onClose={handleCloseModal}>
                {modalContent}
            </Modal>
        </div>
    );  
};

export default BookMark;