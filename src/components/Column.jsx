import { Droppable } from '@hello-pangea/dnd';
import Task from './Task';
import { useState, memo } from 'react';
import { useBoard } from '@/context/BoardContext';
import toast from 'react-hot-toast';

const Column = memo(function Column({ column }) {
  const { addTask } = useBoard();
  const [newTask, setNewTask] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newTask.trim()) return;

    setIsAdding(true);
    try {
      await addTask(column.id, {
        title: newTask.trim(),
        description: '',
        assignedTo: null
      });
      setNewTask('');
      toast.success('Task added successfully!');
    } catch (error) {
      toast.error('Failed to add task. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };


  return (
    <div className="column" style={{
      minWidth: 320,
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Column Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
        position: 'relative'
      }}>
        <div style={{
          width: '4px',
          height: '24px',
          background: column.id === 'todo' ? '#4caf50' :
            column.id === 'inprogress' ? '#ff9800' : '#2196f3',
          borderRadius: '2px',
          marginRight: '12px'
        }} />
        <h2 style={{
          margin: '0',
          color: '#2c3e50',
          fontSize: '1.2rem',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>
          {column.title}
        </h2>
        <div style={{
          marginLeft: 'auto',
          background: 'rgba(0,0,0,0.1)',
          borderRadius: '12px',
          padding: '4px 8px',
          fontSize: '12px',
          fontWeight: '600',
          color: '#666'
        }}>
          {column.tasks.length}
        </div>
      </div>

      {/* Drop Zone */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`drop-zone ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
            style={{
              minHeight: 200,
              padding: '12px',
              borderRadius: '12px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {column.tasks.map((task, index) => (
              <Task key={task.id || task._id} task={task} index={index} />
            ))}
            {provided.placeholder}

            {/* Empty State */}
            {column.tasks.length === 0 && (
              <div style={{
                textAlign: 'center',
                color: '#999',
                fontSize: '14px',
                padding: '40px 20px',
                fontStyle: 'italic'
              }}>
                No tasks yet. Add one below!
              </div>
            )}
          </div>
        )}
      </Droppable>

      {/* Add Task Form */}
      <div style={{
        marginTop: '20px',
        display: 'flex',
        gap: '12px',
        alignItems: 'stretch'
      }}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task..."
          disabled={isAdding}
          className="task-input"
          style={{
            flex: 1,
            padding: '12px 16px',
            fontSize: '14px',
            border: '2px solid transparent',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.9)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
        <button
          onClick={handleAdd}
          disabled={isAdding || !newTask.trim()}
          className="add-button"
          style={{
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '8px',
            border: 'none',
            cursor: isAdding || !newTask.trim() ? 'not-allowed' : 'pointer',
            opacity: isAdding || !newTask.trim() ? 0.6 : 1,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {isAdding ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Adding...
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>+</span>
              Add
            </span>
          )}
        </button>
      </div>
    </div>
  );
});

export default Column;
