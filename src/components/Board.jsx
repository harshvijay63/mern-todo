import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import { useBoard } from '@/context/BoardContext';

export default function Board({ board }) {
  const { moveTask } = useBoard();

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    moveTask(source, destination, draggableId);
  };

  if (!board) return null;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div style={{
        display: 'flex',
        gap: '20px',
        padding: '0',
        justifyContent: 'center',
        flexWrap: 'wrap',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {board.columns.map((column, index) => (
          <div key={column.id}>
            <Column column={column} />
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
