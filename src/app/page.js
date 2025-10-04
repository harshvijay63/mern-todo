'use client';

import { useEffect, useState } from 'react';
import { BoardProvider, useBoard } from '@/context/BoardContext';
import Board from '@/components/Board';
import { Toaster } from 'react-hot-toast';

function KanbanBoard() {
  const [isClient, setIsClient] = useState(false);
  const { state, loadBoard } = useBoard();

  useEffect(() => {
    setIsClient(true);
    loadBoard();
  }, []);

  if (!isClient) {
    return (
      <div className="kanban-board" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            margin: '0',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            Loading your Kanban Board...
          </h2>
          <p style={{
            fontSize: '1rem',
            opacity: 0.8,
            margin: '10px 0 0 0'
          }}>
            Setting up your workspace ✨
          </p>
        </div>
      </div>
    );
  }

  if (state.loading) return (
    <div className="kanban-board" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh'
    }}>
      <div style={{
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid rgba(255,255,255,0.3)',
          borderTop: '4px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }} />
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          margin: '0',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          Loading your Kanban Board...
        </h2>
        <p style={{
          fontSize: '1rem',
          opacity: 0.8,
          margin: '10px 0 0 0'
        }}>
          Setting up your workspace ✨
        </p>
      </div>
    </div>
  );

  return (
    <div className="kanban-board">
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{
          color: '#2c3e50',
          fontSize: '2rem',
          fontWeight: '600',
          margin: '0',
        }}>
          Kanban Board
        </h1>
      </div>
      <Board board={state.board} />
    </div>
  );
}

export default function Home() {
  return (
    <BoardProvider>
      <KanbanBoard />
      <Toaster position="top-right" />
    </BoardProvider>
  );
}
