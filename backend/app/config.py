"""
Configuration loader for the Face Recognition Attendance System
"""
import yaml
import os
from pathlib import Path
from typing import Dict, Any

class Config:
    _instance = None
    _config: Dict[str, Any] = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Config, cls).__new__(cls)
            cls._instance._load_config()
        return cls._instance
    
    def _load_config(self):
        """Load configuration from config.yaml"""
        config_path = Path(__file__).parent.parent / "config.yaml"
        
        if not config_path.exists():
            raise FileNotFoundError(f"Configuration file not found: {config_path}")
        
        with open(config_path, 'r') as f:
            self._config = yaml.safe_load(f)
        
        print(f"✓ Configuration loaded from {config_path}")
    
    def get(self, key_path: str, default=None):
        """
        Get configuration value using dot notation
        Example: config.get('face_recognition.detection.det_threshold_gpu')
        """
        keys = key_path.split('.')
        value = self._config
        
        for key in keys:
            if isinstance(value, dict) and key in value:
                value = value[key]
            else:
                return default
        
        return value
    
    def get_section(self, section: str) -> Dict[str, Any]:
        """Get entire configuration section"""
        return self._config.get(section, {})
    
    @property
    def all(self) -> Dict[str, Any]:
        """Get all configuration"""
        return self._config


# Singleton instance
config = Config()

# Convenience accessors
def get_face_recognition_config():
    return config.get_section('face_recognition')

def get_attendance_config():
    return config.get_section('attendance')

def get_database_config():
    return config.get_section('database')

def get_api_config():
    return config.get_section('api')

def get_bounding_box_config():
    return config.get_section('bounding_box')

def get_student_photos_config():
    return config.get_section('student_photos')

def get_live_stream_config():
    return config.get_section('live_stream')
