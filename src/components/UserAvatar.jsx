export default function UserAvatar({ user, size = 'small' }) {
    const sizeClasses = {
        small: { width: 24, height: 24, fontSize: 12 },
        medium: { width: 32, height: 32, fontSize: 14 },
        large: { width: 40, height: 40, fontSize: 16 }
    };

    const styles = sizeClasses[size] || sizeClasses.small;

    return (
        <div
            style={{
                width: styles.width,
                height: styles.height,
                borderRadius: '50%',
                backgroundColor: '#007bff',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: styles.fontSize,
                fontWeight: 'bold',
                marginRight: 8,
            }}
            title={user?.name || 'User'}
        >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
    );
}
