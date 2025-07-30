import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log to analytics or error reporting service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">앗! 문제가 발생했습니다</h2>
            <p className="error-message">
              일시적인 오류가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
            </p>
            
            <div className="error-actions">
              <button 
                className="error-button primary"
                onClick={() => window.location.reload()}
              >
                페이지 새로고침
              </button>
              <button 
                className="error-button secondary"
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              >
                다시 시도
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>개발자 정보</summary>
                <div className="error-stack">
                  <h4>Error:</h4>
                  <pre>{this.state.error && this.state.error.toString()}</pre>
                  <h4>Component Stack:</h4>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </div>
              </details>
            )}
          </div>

          <style jsx>{`
            .error-boundary {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
              background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            }

            .error-boundary-content {
              background: white;
              border-radius: 16px;
              padding: 40px;
              max-width: 500px;
              width: 100%;
              text-align: center;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            }

            .error-icon {
              font-size: 64px;
              margin-bottom: 20px;
            }

            .error-title {
              font-size: 24px;
              font-weight: 700;
              color: #1e293b;
              margin-bottom: 16px;
            }

            .error-message {
              font-size: 16px;
              color: #64748b;
              line-height: 1.5;
              margin-bottom: 32px;
            }

            .error-actions {
              display: flex;
              gap: 12px;
              justify-content: center;
              flex-wrap: wrap;
            }

            .error-button {
              padding: 12px 24px;
              border-radius: 12px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s ease;
              border: none;
              font-size: 14px;
            }

            .error-button.primary {
              background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
              color: white;
            }

            .error-button.primary:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 20px rgba(79, 172, 254, 0.3);
            }

            .error-button.secondary {
              background: #f8fafc;
              border: 2px solid #e2e8f0;
              color: #64748b;
            }

            .error-button.secondary:hover {
              background: #f1f5f9;
              border-color: #cbd5e1;
            }

            .error-details {
              margin-top: 24px;
              text-align: left;
              background: #f8fafc;
              border-radius: 8px;
              padding: 16px;
            }

            .error-details summary {
              cursor: pointer;
              font-weight: 600;
              margin-bottom: 12px;
            }

            .error-stack pre {
              font-size: 12px;
              color: #dc2626;
              background: white;
              padding: 8px;
              border-radius: 4px;
              overflow-x: auto;
              margin: 8px 0;
            }

            @media (max-width: 768px) {
              .error-boundary-content {
                padding: 24px;
                margin: 16px;
              }

              .error-actions {
                flex-direction: column;
              }

              .error-button {
                width: 100%;
              }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;