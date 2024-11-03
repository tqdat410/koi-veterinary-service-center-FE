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
                        <ul className="list-group">
                            {koiFishData.map(fish => (
                                <li key={fish.fish_id} className="list-group-item" onClick={() => onSelectFish(fish.fish_id)}>
                                    {fish.species} (ID: {fish.fish_id})
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FishSelectionModal;
