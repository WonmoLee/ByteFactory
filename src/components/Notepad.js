import React from 'react';
import '../assets/Notepad.css'; // CSS 파일을 불러옵니다.

const Notepad = ({ showNotepad, setShowNotepad, setNodes, nodes }) => {

    const handleInputChange = (e) => {
        const { value } = e.target;
        setShowNotepad(prevState => ({
            ...prevState,
        context: value
        }));

        const updateRecursive = (nodes, nodeId, newContext) => nodes.map((node) => {
            if (node.id === nodeId) {
                return { ...node, context: newContext };
            } else if (node.children) {
                return { ...node, children: updateRecursive(node.children, nodeId, newContext) }; // 재귀적으로 자식 노드도 업데이트
            }

            return node;
        });

        setNodes(updateRecursive(nodes, showNotepad.id, value));
    };

    return (
        <div className='notepad'
             style={{ display : showNotepad.visible ? 'block' : 'none', zIndex : 10 }}
        >
            <div className='notepad-head'>
                <p className='notepad-maintext'>{showNotepad.maintext}</p>
                <button className='notepad-close' onClick={() => setShowNotepad({ visible: false, id: null, maintext: null, context: null })}>X</button>
            </div>
            <div className='notepad-body'>
                <textarea className='notepad-text' value={showNotepad.context} onChange={handleInputChange}></textarea>
            </div>
        </div>
    );
};

export default Notepad;


