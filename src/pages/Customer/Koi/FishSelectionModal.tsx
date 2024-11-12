import React from 'react';

interface FishSelectionModalProps {
    koiFishData: any[];
    onSelectFish: (fishId: number) => void; // Callback function to handle fish selection
    onClose: () => void; // Callback function to close the modal
}

const FishSelectionModal: React.FC<FishSelectionModalProps> = ({ koiFishData, onSelectFish, onClose }) => {
    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', alignContent: 'center' }}>
            <div className="modal-dialog" style={{textAlign: 'left'}}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Select a Fish</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body" style={{borderRadius: '16px', paddingTop: '12px'}}>
                        <div className="list-group">
                            {koiFishData.map(fish => (
                                <button 
                                    key={fish.fish_id} 
                                    className="list-group-item list-group-item-action"
                                    onClick={() => onSelectFish(fish.fish_id)}
                                    style={{ cursor: 'pointer', textAlign: 'left', backgroundColor: 'lightblue', border: '1px solid black'}}
                                >
                                    {fish.species} (ID: {fish.fish_id})
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FishSelectionModal;
