import React, { useState, useRef } from 'react';
import ReactDiffViewer from 'react-diff-viewer';

import '../assets/TextDiffViewer.css'; // 스타일시트 임포트

const TextDiffViewer = () => {
    const [oldText, setOldText] = useState('');
    const [newText, setNewText] = useState('');
    const oldTextRef = useRef(null); // 원본 텍스트를 위한 ref
    const newTextRef = useRef(null); // 수정된 텍스트를 위한 ref
    const oldLineNumberRef = useRef(null); // 원본 텍스트 행 번호를 위한 ref
    const newLineNumberRef = useRef(null); // 수정된 텍스트 행 번호를 위한 ref

    // 스크롤 이벤트 핸들러를 업데이트하여 모든 관련된 컴포넌트를 동기화
    const handleScroll = (sourceRef) => {
        const scrollPosition = sourceRef.current.scrollTop;
        // 모든 관련된 컴포넌트의 스크롤 위치를 동기화
        [oldTextRef, newTextRef, oldLineNumberRef, newLineNumberRef].forEach(ref => {
            if (ref.current !== sourceRef.current) {
                ref.current.scrollTop = scrollPosition;
            }
        });
    };

    // 행 번호를 업데이트하는 함수
    const generateLineNumbers = (text) => {
        const lineNumbers = text.split('\n').map((_, index) => `${index + 1}`).join('\n');
        return lineNumbers;
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ width: '48%' }}>
                    <h2>원본 텍스트</h2>
                    <div className="textAreaContainer">
                        <pre ref={oldLineNumberRef} className="lineNumbers">
                            {generateLineNumbers(oldText)}
                        </pre>
                        <textarea
                            ref={oldTextRef}
                            className="textArea"
                            value={oldText}
                            onChange={(e) => setOldText(e.target.value)}
                            onScroll={() => handleScroll(oldTextRef)}
                        />
                    </div>
                </div>
                <div style={{ width: '48%' }}>
                    <h2>수정된 텍스트</h2>
                    <div className="textAreaContainer">
                        <pre ref={newLineNumberRef} className="lineNumbers">
                            {generateLineNumbers(newText)}
                        </pre>
                        <textarea
                            ref={newTextRef}
                            className="textArea"
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                            onScroll={() => handleScroll(newTextRef)}
                        />
                    </div>
                </div>
            </div>
            <ReactDiffViewer oldValue={oldText} newValue={newText} splitView={true} />
        </div>
    );
};

export default TextDiffViewer;