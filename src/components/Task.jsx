import { Draggable } from '@hello-pangea/dnd';
import { useState, useEffect, memo } from 'react';
import { useBoard } from '@/context/BoardContext';
import toast from 'react-hot-toast';

const Task = memo(function Task({ task, index }) {
  const { updateTask, deleteTask } = useBoard();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [isDeleting, setIsDeleting] = useState(false);

  // Update editTitle when task.title changes (but not when editing)
  useEffect(() => {
    if (!isEditing) {
      setEditTitle(task.title);
    }
  }, [task.title, isEditing]);

  const handleEdit = async () => {
    if (!editTitle.trim()) {
      setEditTitle(task.title);
      setIsEditing(false);
      return;
    }

    try {
      console.log('Task object:', task);
      console.log('Task ID:', task.id || task._id);
      console.log('New title:', editTitle.trim());

      await updateTask(task.id || task._id, { title: editTitle.trim() });
      setIsEditing(false);
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Edit failed:', error);
      setEditTitle(task.title);
      setIsEditing(false);
      toast.error('Failed to update task. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    setIsDeleting(true);
    try {
      await deleteTask(task.id || task._id);
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete task. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      handleEdit();
    } else {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };


  return (
    <Draggable
      draggableId={task.id || task._id}
      index={index}
      isDragDisabled={isDeleting}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task ${snapshot.isDragging ? 'dragging' : ''}`}
          style={{
            ...provided.draggableProps.style,
            margin: '8px 0',
            padding: '16px',
            borderRadius: '8px',
            cursor: snapshot.isDragging ? 'grabbing' : 'grab',
            opacity: isDeleting ? 0.5 : 1,
            background: 'white',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            zIndex: snapshot.isDragging ? 1000 : 1,
          }}
        >

          {isEditing ? (
            <div>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                onBlur={handleBlur}
                autoFocus
                className="task-input"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: '2px solid #667eea',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.9)',
                  outline: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            </div>
          ) : (
            <div>
              {/* Task Title */}
              <div
                style={{
                  fontWeight: '600',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  color: '#2c3e50',
                  fontSize: '15px',
                  lineHeight: '1.4',
                  paddingRight: '30px',
                  transition: 'color 0.3s ease'
                }}
                onClick={() => setIsEditing(true)}
                onMouseEnter={(e) => e.target.style.color = '#667eea'}
                onMouseLeave={(e) => e.target.style.color = '#2c3e50'}
              >
                {task.title}
              </div>

              {/* Task Description */}
              {task.description && (
                <div
                  style={{
                    fontSize: '13px',
                    color: '#666',
                    marginBottom: '12px',
                    lineHeight: '1.4',
                    fontStyle: 'italic'
                  }}
                >
                  {task.description}
                </div>
              )}

              {/* Assigned User */}
              {task.assignedTo && (
                <div
                  style={{
                    fontSize: '12px',
                    color: '#667eea',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '500'
                  }}
                >
                  <span style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    {task.assignedTo.charAt(0).toUpperCase()}
                  </span>
                  {task.assignedTo}
                </div>
              )}

              {/* Task Actions */}
              <div className="task-actions" style={{
                display: 'flex',
                gap: '8px',
                marginTop: '12px',
                opacity: 1,
                transition: 'opacity 0.2s ease'
              }}>
                <button
                  onClick={() => setIsEditing(true)}
                  className="edit-button"
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="delete-button"
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                    opacity: isDeleting ? 0.6 : 1,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {isDeleting ? (
                    <>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Deleting...
                    </>
                  ) : (
                    <>
                      🗑️ Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
});

export default Task;
