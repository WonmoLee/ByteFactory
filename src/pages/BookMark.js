import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';

import '../assets/BookMark.css'; // 스타일시트 임포트

const BookMark = () => {
    const [nodes, setNodes] = useState([]);
    const [bookmarkName, setBookmarkName] = useState('');
    const [bookmarkUrl, setBookmarkUrl] = useState('');
    const [folderName, setFolderName] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [selectedPath, setSelectedPath] = useState([]);

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

    const addFolder = () => {
        if (!folderName.trim()) return;
    
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
        if (!bookmarkName.trim() || !bookmarkUrl.trim()) return;
    
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

    const deleteNode = (nodeId, parentId = null) => {
        if (parentId === null) {
            // 최상위 레벨에서 노드 삭제
            setNodes(nodes.filter(node => node.id !== nodeId));
        } else {
            // 재귀적으로 부모를 찾아 자식 노드 삭제
            setNodes(nodes.map(node => {
                if (node.id === parentId) {
                    return {
                        ...node,
                        children: node.children.filter(child => child.id !== nodeId)
                    };
                } else if (node.children) {
                    return {
                        ...node,
                        children: deleteNode(nodeId, parentId, node.children)
                    };
                }
                return node;
            }));
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
                         onClick={() => node.type === 'folder' ? handleFolderClick(node.id) : openExternalLink(node.url)}
                         style={{
                             cursor: 'pointer',
                             padding: '5px',
                             backgroundColor: selectedPath.includes(node.id) ? '#007bff' : 'transparent',
                             color: selectedPath.includes(node.id) ? '#000000' : '#ffffff', // 선택된 요소의 텍스트 색상도 변경
                         }}>
                        {node.type === 'folder' ? '📁' : '🔗'} {node.name}
                    </div>
                ))}
            </div>
        );
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
                    <button onClick={openFinder} className="btn_finder">파일 탐색기</button>
                </div>
            </div>

            <div className="right-panel">
                {renderColumnView()}
            </div>
            <Modal show={showModal} onClose={handleCloseModal}>
                {modalContent}
            </Modal>
        </div>
    );  
};

export default BookMark;