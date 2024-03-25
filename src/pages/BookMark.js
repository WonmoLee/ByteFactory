import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';

import '../assets/BookMark.css'; // 스타일시트 임포트
import FinderIcon from '../assets/imgs/finderIcon.png';

const BookMark = () => {
    const [nodes, setNodes] = useState([]);
    const [bookmarkName, setBookmarkName] = useState('');
    const [bookmarkUrl, setBookmarkUrl] = useState('');

    const [notepad, setNotepad] = useState('');
    const [showNotepad, setShowNotepad] = useState({visible : false, id: null, maintext: null, context: null});

    const [folderName, setFolderName] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [selectedPath, setSelectedPath] = useState([]);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, selectedNodeId: null });
    const [editingNodeId, setEditingNodeId] = useState(null);
    const [editingNodeName, setEditingNodeName] = useState("");
    const [dragOverNodeId, setDragOverNodeId] = useState({ id: null, isTopHalf: false });

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
                const isNodeContainerClick = event.target.closest('.node-outter-container');
    
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

    const setNotepadContext = (e, node, id) => {
        const node_id = findNodeById(node, id);
        setShowNotepad({ visible: true, id: node_id.id, maintext: node_id.name, context: e.target.value });

        const updateRecursive = (nodes, nodeId, newContext) => nodes.map((node) => {
            if (node.id === nodeId) {
                return { ...node, context: newContext };
            } else if (node.children) {
                return { ...node, children: updateRecursive(node.children, nodeId, newContext) }; // 재귀적으로 자식 노드도 업데이트
            }
            
            return node;
        });

        setNodes(updateRecursive(nodes, node_id.id, e.target.value));
    }

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
        if (window && window.electron) {
            window.electron.send('open-link-external', '파일 탐색기');
          } else {
            document.getElementById('fileInput').click();
          }
    }

    const addNotepad = () => {
        if (!notepad.trim()) {
            handleOpenModal('메모 이름을 입력해주세요.');
            return;
        }
    
        const newNotepad = {
            id: Date.now(),
            name: notepad,
            context : "",
            type: 'notepad',
            parentId: selectedPath[selectedPath.length - 1] || null, // selectedPath의 마지막 요소를 부모 ID로 사용
        };
    
        if (newNotepad.parentId) {
            // 선택된 폴더(현재 선택된 경로의 마지막 요소)에 새 메모를 추가합니다.
            const updatedNodes = addNodeToFolder(nodes, newNotepad.parentId, newNotepad);
            setNodes(updatedNodes);
        } else {
            // 최상위 레벨에 새 메모를 추가합니다.
            setNodes([...nodes, newNotepad]);
        }
        setNotepad('');
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
        if (window && window.electron) {
            window.electron.send('open-link-external', url); // 일렉트론 환경에서 링크 열기
          } else {
            window.open(url, '_blank'); // 웹 환경에서 링크 열기
          }
    };

    const openClickNotepad = (node) => {
        if (!node) return null;

        setShowNotepad({visible : true, id : node.id, maintext : node.name, context : node.context});
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

    
    
    const renderColumnView = () => {
        if (nodes.length === 0) {
            return (
                <div className="empty-message">
                    북마크를 등록해주세요.
                </div>
            );
        }
    
        // 모든 컬럼의 렌더링 결과를 담을 배열
        const columns = [];
    
        // 최상위 노드 컬럼 추가
        columns.push(
            <div key="column-root" style={{ minWidth: '200px', padding: '10px' }}>
                {renderNodes(nodes.filter(node => !node.parentId), [])}
            </div>
        );
    
        // 선택된 경로에 있는 각 폴더의 하위 노드 컬럼 추가
        selectedPath.forEach((folderId, index) => {
            const currentPath = selectedPath.slice(0, index + 1);
            const folder = findNodeById(nodes, folderId);
            if (folder) {
                // 마지막 컬럼인 경우에는 borderRight 스타일을 적용하지 않습니다.
                const columnStyle = {
                    minWidth: '200px',
                    padding: '10px',
                };
                columns.push(
                    <div key={`column-${folderId}`} style={columnStyle}>
                        {renderNodes(folder.children, currentPath)}
                    </div>
                );
            }
        });
    
        return (
            <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
                {columns}
            </div>
        );
    };
    
    const renderNodes = (nodes) => {
        // nodes 배열이 비어 있으면 안내 메시지를 표시합니다.
        if (nodes.length === 0) {
            return (
                <div className="empty-message" style={{ minWidth: '200px', padding: '20px 10px', textAlign: 'center' }}>
                    북마크를 등록해주세요.
                </div>
            );
        }
    
        // nodes 배열에 내용이 있을 경우 기존 로직을 수행합니다.
        return (
            <div className="node-outter-container"
                 style={{ minWidth: '200px', borderRight: '1px solid #ccc', padding: '10px'}}
            >
                {nodes.map(node => (
                    <div key={node.id} className="node-big-container"
                         onDragOver={(e) => handleBigDragOver(e, node.id)}
                         onDrop={(e) => handleBigDrop(e, node.id)}
                         onDragLeave={(e) => handleBigDragLeave(e)}
                         style={{
                            borderTop : (dragOverNodeId && dragOverNodeId.id === node.id) ?
                            (dragOverNodeId.isTopHalf)
                            ? "3px solid blue" : "0px": "0px",
                            borderBottom : (dragOverNodeId && dragOverNodeId.id === node.id) ?
                            (!dragOverNodeId.isTopHalf)
                            ? "3px solid blue" : "0px": "0px",
                        }}
                    >
                        <div key={node.id}
                            className="node-container"
                            onClick={() => node.type === 'folder' ? handleFolderClick(node.id)
                                            : node.type === 'bookmark' ? openExternalLink(node.url)
                                            : openClickNotepad(node)
                            }
                            onContextMenu={(e) => handleContextMenu(e, node.id)}
                            draggable="true" // 드래그 가능한 요소로 설정
                            onDragStart={(e) => handleDragStart(e, node.id)} // 드래그 시작 이벤트 핸들러
                            onDragOver={(e) => handleDragOver(e)} // 드래그 오버 이벤트 핸들러
                            onDrop={(e) => handleDrop(e, node.id)} // 드롭 이벤트 핸들러
                            style={{
                                backgroundColor: (selectedPath.includes(node.id) ? '#007bff' : 'transparent'),
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
                                    {node.type === 'folder' ? (selectedPath.includes(node.id) ? '📂' : '📁')
                                         : node.type === 'bookmark' ? '🔗'
                                         : '📝' // 여긴 지금 notepad
                                     } {node.name}
                                </span>
                            )}
                        </div>
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
        const stack = [...nodes];
        
        while (stack.length > 0) {
            const currentNode = stack.pop();
    
            if (currentNode && Number(currentNode.id) === Number(id)) {
                return currentNode;
            }
    
            if (currentNode && currentNode.children) {
                stack.push(...currentNode.children);
            }
        }
    
        return null;
    };

    // 부모 노드를 찾는 함수
    const findNodeParent = (nodes, nodeId) => {
        const stack = [...nodes];
    
        while (stack.length > 0) {
            const currentNode = stack.pop();
    
            if (currentNode.children && currentNode.children.some(child => Number(child.id) === Number(nodeId))) {
                return currentNode;
            }
    
            if (currentNode.children) {
                stack.push(...currentNode.children);
            }
        }
    
        return null;
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

    const handleDragStart = (e, nodeId) => {
        e.dataTransfer.setData("nodeId", nodeId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, targetNodeId) => {
        const draggedNodeId = e.dataTransfer.getData("nodeId");
        const childrenId = isFindNodeChildren(nodes, draggedNodeId, targetNodeId);

        if(findNodeById(nodes, targetNodeId).type !== "folder") {
            return false;
        }

        if(childrenId) {
            setDragOverNodeId(null);
            return false;
        }

        if (draggedNodeId && Number(draggedNodeId) !== Number(targetNodeId)) {
            // 새로운 노드 배열을 생성하여 상태를 업데이트합니다.
            let updatedNodes = moveNode([...nodes], draggedNodeId, targetNodeId);
    
            // g2를 삭제합니다.
            updatedNodes = updatedNodes.filter(node => Number(node.id) !== Number(draggedNodeId))
    
            // 이동한 후의 노드 위치를 찾습니다.
            const newLocationNode = findNodeById(updatedNodes, draggedNodeId);
    
            // 이동한 노드의 새로운 경로를 찾아 setSelectedPath를 호출합니다.
            const newPath = findPathToNode(updatedNodes, newLocationNode.id);
            setSelectedPath(newPath);
            setNodes(updatedNodes);
        }
        setDragOverNodeId(null); // 드래그 오버 상태 초기화
    };

    // 자식이면 true
    const isFindNodeChildren = (nodes, nodeId, targetNodeId) => {
        // 드래그된 노드를 찾습니다.
        const draggedNode = findNodeById(nodes, nodeId);

        // 드래그된 노드를 찾지 못한 경우 false를 반환합니다.
        if (!draggedNode) {
            return false;
        }

        // 타겟 노드를 찾습니다.
        const targetNode = findNodeById(nodes, targetNodeId);

        // 타겟 노드를 찾지 못한 경우 false를 반환합니다.
        if (!targetNode) {
            return false;
        }

        // 타겟 노드의 모든 자식을 확인합니다.
        if (draggedNode.children) {
            for (const child of draggedNode.children) {
                // 자식 노드가 드래그된 노드와 같은 경우 또는 자식의 자식인 경우 true를 반환합니다.
                if (Number(child.id) === Number(targetNodeId) || isFindNodeChildren(nodes, child.id, targetNodeId)) {
                    return true;
                }
            }
        }

        // 자식 노드가 아니거나 자식의 자식이 아닌 경우 false를 반환합니다.
        return false;
    }

    const moveNode = (nodes, draggedNodeId, targetNodeId) => {
        // 드래그된 노드를 찾습니다.
        const draggedNode = findNodeById(nodes, draggedNodeId);
    
        // 드래그된 노드를 찾지 못한 경우 원래의 노드 배열을 반환합니다.
        if (!draggedNode) {
            return nodes;
        }
    
        // 타겟 노드를 찾습니다.
        const targetNode = findNodeById(nodes, targetNodeId);
    
        // 타겟 노드를 찾지 못한 경우 원래의 노드 배열을 반환합니다.
        if (!targetNode) {
            return nodes;
        }
    
        // 타겟 노드의 부모 노드를 찾습니다.
        const targetParentNode = findNodeParent(nodes, targetNodeId);
    
        // 드래그된 노드가 이미 타겟 노드의 자식인 경우 노드 이동을 취소합니다.
        if (targetNode.children && targetNode.children.some(child => Number(child.id) === Number(draggedNodeId))) {
            return nodes;
        }
    
        // 드래그된 노드의 부모 노드를 찾습니다.
        const draggedParentNode = findNodeParent(nodes, draggedNodeId);
    
        // 드래그된 노드를 타겟 노드의 자식으로 추가합니다.
        targetNode.children.push({ ...draggedNode, parentId: targetNodeId });
    
        // 드래그된 노드를 기존 위치에서 삭제합니다.
        if (draggedParentNode) {
            draggedParentNode.children = draggedParentNode.children.filter(child => Number(child.id) !== Number(draggedNodeId));
        }
    
        // 부모로 이동되는 경우 부모 노드가 변경되므로 부모 노드의 children을 업데이트합니다.
        if (targetParentNode) {
            const updatedChildren = targetParentNode.children.map(child => {
                if (Number(child.id) === Number(draggedNodeId)) {
                    return null;
                }
                return child;
            }).filter(Boolean);
            targetParentNode.children = updatedChildren;
        }
    
        // 업데이트된 노드 목록을 반환합니다.
        return nodes;
    };
    
    
    



    const handleBigDragOver = (e, nodeId) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy'; // 드롭 효과 설정

        const mouseY = e.clientY;
        const targetRect = e.target.getBoundingClientRect();
        const targetTop = targetRect.top;
        const targetBottom = targetRect.bottom;

        // 마우스의 Y 좌표가 타겟 요소의 상단 절반인지 하단 절반인지 확인
        const isTopHalf = mouseY < (targetTop + targetBottom) / 2;

        if( e.target.className !== "node-big-container") {
            setDragOverNodeId(null);
        } else {
            if(isTopHalf) {
                setDragOverNodeId({id:nodeId, isTopHalf:true});
            } else {
                setDragOverNodeId({id:nodeId, isTopHalf:false});
            }
        }
        
        
    };
    
    const handleBigDrop = (e, targetNodeId) => {
        e.preventDefault();
        
        const draggedNodeId = e.dataTransfer.getData("nodeId");
        const mouseY = e.clientY;
        const targetRect = e.target.getBoundingClientRect();
        const targetTop = targetRect.top;
        const targetBottom = targetRect.bottom;

        const childrenId = isFindNodeChildren(nodes, draggedNodeId, targetNodeId);

        if(childrenId) {
            setDragOverNodeId(null);
            return false;
        }

        if(e.target.className !== "node-big-container") {
            setDragOverNodeId(null);
            return false;
        }

        // 마우스의 Y 좌표가 타겟 요소의 상단 절반인지 하단 절반인지 확인
        const isTopHalf = mouseY < (targetTop + targetBottom) / 2;

        // isTopHalf 변수를 사용하여 드롭된 위치를 구분할 수 있음
        let updatedNodes = moveNode2([...nodes], draggedNodeId, targetNodeId, isTopHalf);
    
        // 이동한 후의 노드 위치를 찾습니다.
        const newLocationNode = findNodeById(updatedNodes, draggedNodeId);
    
        // 이동한 노드의 새로운 경로를 찾아 setSelectedPath를 호출합니다.
        const newPath = findPathToNode(updatedNodes, newLocationNode.id);
        setSelectedPath(newPath);

        setDragOverNodeId(null); // 드래그 오버 상태 초기화
        setNodes(updatedNodes);
    };

    // 드래그 이벤트가 끝날 때의 핸들러
    const handleBigDragLeave = (e) => {
        setDragOverNodeId(null); // 드래그 오버 상태 초기화
    };

    const moveNode2 = (nodes, draggedNodeId, targetNodeId, isTopHalf) => {
        // 드래그된 노드를 찾습니다.
        const draggedNode = findNodeById(nodes, draggedNodeId);
    
        // 드래그된 노드를 찾지 못한 경우 원래의 노드 배열을 반환합니다.
        if (!draggedNode) {
            return nodes;
        }
    
        // 타겟 노드를 찾습니다.
        const targetNode = findNodeById(nodes, targetNodeId);
    
        // 타겟 노드를 찾지 못한 경우 원래의 노드 배열을 반환합니다.
        if (!targetNode) {
            return nodes;
        }
    
        // 타겟 노드의 부모 노드를 찾습니다.
        const targetParentNode = findNodeParent(nodes, targetNodeId);

        // 드래그된 노드를 기존 위치에서 삭제합니다.
        let updatedNodes = removeNodeAndChildren(nodes, draggedNodeId);
    
        // 드래그된 노드를 타겟 노드의 바로 위나 아래에 추가하기 위해 새로운 변수에 저장합니다.
        const nodeToAdd = { ...draggedNode, parentId: targetParentNode ? targetParentNode.id : null };
    
        // 드래그된 노드를 타겟 노드의 바로 위나 아래에 추가합니다.
        if (isTopHalf) {
            // 타겟 노드의 바로 위에 추가하는 로직
            if (targetParentNode) {
                const index = targetParentNode.children.findIndex(child => Number(child.id) === Number(targetNodeId));
                targetParentNode.children.splice(index, 0, nodeToAdd);
            } else {
                // 타겟 노드가 최상위 노드인 경우
                const index = updatedNodes.findIndex(node => Number(node.id) === Number(targetNodeId));
                updatedNodes.splice(index, 0, nodeToAdd);
            }
        } else {
            // 타겟 노드의 바로 아래에 추가하는 로직
            if (targetParentNode) {
                const index = targetParentNode.children.findIndex(child => Number(child.id) === Number(targetNodeId));
                targetParentNode.children.splice(index + 1, 0, nodeToAdd);
            } else {
                // 타겟 노드가 최상위 노드인 경우
                const index = updatedNodes.findIndex(node => Number(node.id) === Number(targetNodeId));
                updatedNodes.splice(index + 1, 0, nodeToAdd);
            }
        }
    
        // 업데이트된 노드 목록을 반환합니다.
        return updatedNodes;
    };

    // 드래그된 노드를 기존 위치에서 삭제합니다.
    const removeNodeAndChildren = (nodes, nodeId) => {
        return nodes.filter(node => {
            if (Number(node.id) === Number(nodeId)) {
                return false; // 해당 노드를 삭제합니다.
            }
            // 자식 노드가 있는 경우 재귀적으로 자식 노드도 삭제합니다.
            if (node.children) {
                node.children = removeNodeAndChildren(node.children, nodeId);
            }
            return true;
        });
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
                    <input
                        type="text"
                        value={notepad}
                        className="input"
                        onChange={(e) => setNotepad(e.target.value)}
                        placeholder="메모 이름"
                    />
                    <button onClick={addNotepad} className="button">메모 추가</button>
                    <button onClick={openFinder} className="btn_finder">
                        <p>파일탐색기 / <img src={FinderIcon} alt="Finder" /></p>
                    </button>
                </div>
            </div>

            <div className="right-panel">
                {renderColumnView()}
                {renderContextMenu()}
            </div>

            <div className='notepad' style={{ visibility: showNotepad.visible ? "visible" : "hidden" }}>
                <div className='notepad-head'>
                    <p className='notepad-maintext'>{showNotepad.maintext}</p>
                    <button className='notepad-close' onClick={() => {setShowNotepad(false)}}>X</button>
                </div>
                <div className='notepad-body'>
                    <textarea className='notepad-text' 
                     value={showNotepad.context} onChange={(e) => {setNotepadContext(e, nodes, showNotepad.id)}}></textarea>
                </div>
            </div>

            <Modal show={showModal} onClose={handleCloseModal}>
                {modalContent}
            </Modal>

            <input type="file" id="fileInput" style={{display: "none"}} />
        </div>
    );  
};

export default BookMark;