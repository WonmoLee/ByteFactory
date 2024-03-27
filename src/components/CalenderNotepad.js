import React from 'react';
import '../assets/Notepad.css'; // CSS 파일을 불러옵니다.

const Notepad = ({ showNotepad, setShowNotepad, setDays, days }) => {

    const handleInputTextChange = (e) => {
        const { value } = e.target;
        setShowNotepad(prevState => ({
            ...prevState,
        context: value
        }));

        setDays(updateRecursive("text", days, showNotepad.id, showNotepad.day, value));
    };

    const handleInputTitleChange = (e) => {
        const { value } = e.target;
        setShowNotepad(prevState => ({
            ...prevState,
            maintext: value
        }));

        setDays(updateRecursive("title", days, showNotepad.id, showNotepad.day, value));
    };

    const updateRecursive = (type, days, dayId, firstDay, newContext) => days.map((day) => {
        if(type === "text") {
            if (day.id === dayId && day.day === firstDay) {
                return { ...day, context: newContext};
            }
        } else if(type === "title") {
            if (day.id === dayId && day.day === firstDay) {
                return { ...day, title: newContext};
            }
        }

        return day;
    });

    return (
        <div className='notepad'
             style={{ display : showNotepad.visible ? 'block' : 'none', zIndex : 10 }}
        >
            <div className='notepad-head'>
                <input type='text' className='notepad-main-input' value={showNotepad.maintext || ''}
                    onChange={(e) => handleInputTitleChange(e)}
                ></input>
                <button className='notepad-close'
                    onClick={() => setShowNotepad({ visible: false, id: null, day: null, maintext: null, context: null })}
                >X</button>
            </div>
            <div className='notepad-body'>
                <textarea className='notepad-text' value={showNotepad.context || ''}
                          onChange={(e) => handleInputTextChange(e)}>
                </textarea>
            </div>
        </div>
    );
};

export default Notepad;


