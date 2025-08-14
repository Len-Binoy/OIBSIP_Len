from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models import db

user_bp = Blueprint('user', __name__)

@user_bp.route('/settings')
@login_required
def settings():
    return render_template('settings.html', user=current_user)

@user_bp.route('/update_profile', methods=['POST'])
@login_required
def update_profile():
    email = request.form.get('email')
    
    if not email:
        flash('Email is required.', 'error')
        return redirect(url_for('user.settings'))
    
    # Check if email is already used by another user
    existing_user = db.session.query(User).filter(User.email == email, User.id != current_user.id).first()
    if existing_user:
        flash('Email address is already in use by another account.', 'error')
        return redirect(url_for('user.settings'))
    
    try:
        current_user.email = email
        db.session.commit()
        flash('Profile updated successfully!', 'success')
    except Exception as e:
        db.session.rollback()
        flash('Profile update failed. Please try again.', 'error')
    
    return redirect(url_for('user.settings'))

@user_bp.route('/change_password', methods=['POST'])
@login_required
def change_password():
    current_password = request.form.get('current_password')
    new_password = request.form.get('new_password')
    
    if not current_password or not new_password:
        flash('Both current and new passwords are required.', 'error')
        return redirect(url_for('user.settings'))
    
    # Verify current password
    if not check_password_hash(current_user.password, current_password):
        flash('Current password is incorrect.', 'error')
        return redirect(url_for('user.settings'))
    
    if len(new_password) < 6:
        flash('New password must be at least 6 characters long.', 'error')
        return redirect(url_for('user.settings'))
    
    try:
        current_user.password = generate_password_hash(new_password, method='pbkdf2:sha256')
        db.session.commit()
        flash('Password changed successfully!', 'success')
    except Exception as e:
        db.session.rollback()
        flash('Password change failed. Please try again.', 'error')
    
    return redirect(url_for('user.settings'))