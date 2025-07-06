#!/usr/bin/env python3
"""
Chaos Command Center - Flask Backend
Handles PDF generation, AI processing, and data analytics
"""

import os
import json
import logging
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from dotenv import load_dotenv

# Import our modules
from pdf_generator import PDFGenerator
from ai_processor import AIProcessor
from analytics import AnalyticsEngine

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Initialize our services
pdf_gen = PDFGenerator()
ai_proc = AIProcessor()
analytics = AnalyticsEngine()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'services': {
            'pdf': True,
            'ai': ai_proc.is_available(),
            'analytics': True
        }
    })

@app.route('/api/pdf/generate', methods=['POST'])
def generate_pdf():
    """Generate PDF report from data"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or 'type' not in data:
            return jsonify({'error': 'Missing report type'}), 400
        
        report_type = data['type']
        report_data = data.get('data', {})
        
        # Generate PDF
        pdf_path = pdf_gen.generate_report(report_type, report_data)
        
        if pdf_path and os.path.exists(pdf_path):
            return send_file(pdf_path, as_attachment=True, 
                           download_name=f'chaos_report_{report_type}_{datetime.now().strftime("%Y%m%d")}.pdf')
        else:
            return jsonify({'error': 'Failed to generate PDF'}), 500
            
    except Exception as e:
        logger.error(f"PDF generation error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/ai/process-voice', methods=['POST'])
def process_voice_note():
    """Process voice note and extract tasks/insights"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Missing voice text'}), 400
        
        voice_text = data['text']
        context = data.get('context', 'general')
        
        # Process with AI
        result = ai_proc.process_voice_note(voice_text, context)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Voice processing error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/ai/analyze-patterns', methods=['POST'])
def analyze_patterns():
    """Analyze patterns in user data"""
    try:
        data = request.get_json()
        
        if not data or 'data' not in data:
            return jsonify({'error': 'Missing data for analysis'}), 400
        
        user_data = data['data']
        analysis_type = data.get('type', 'general')
        
        # Analyze patterns
        insights = ai_proc.analyze_patterns(user_data, analysis_type)
        
        return jsonify(insights)
        
    except Exception as e:
        logger.error(f"Pattern analysis error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/dashboard', methods=['POST'])
def get_dashboard_analytics():
    """Get analytics for dashboard"""
    try:
        data = request.get_json()
        
        if not data or 'data' not in data:
            return jsonify({'error': 'Missing data'}), 400
        
        user_data = data['data']
        date_range = data.get('dateRange', 30)  # Default 30 days
        
        # Generate analytics
        dashboard_data = analytics.generate_dashboard(user_data, date_range)
        
        return jsonify(dashboard_data)
        
    except Exception as e:
        logger.error(f"Analytics error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/sync/phone-home', methods=['POST'])
def phone_home_sync():
    """Handle phone app sync requests"""
    try:
        data = request.get_json()
        
        if not data or 'device_id' not in data:
            return jsonify({'error': 'Missing device ID'}), 400
        
        device_id = data['device_id']
        sync_data = data.get('data', {})
        action = data.get('action', 'sync')
        
        # Handle different sync actions
        if action == 'sync':
            # Merge data from phone
            result = {'status': 'synced', 'conflicts': []}
            # TODO: Implement actual sync logic
            
        elif action == 'pull':
            # Send latest data to phone
            result = {'status': 'data_sent', 'data': {}}
            # TODO: Implement data pull logic
            
        else:
            return jsonify({'error': 'Invalid sync action'}), 400
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Sync error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Development server
    port = int(os.environ.get('FLASK_PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    
    logger.info(f"Starting Chaos Command Center Backend on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
