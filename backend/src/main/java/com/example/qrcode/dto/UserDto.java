package com.example.qrcode.dto;

public class UserDto {
    private Long id;
    private String username;
    private String role;
    private String name;

    public UserDto() {}

    public UserDto(Long id, String username, String role, String name) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.name = name;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getRole() { return role; }
    public String getName() { return name; }

    public void setId(Long id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setRole(String role) { this.role = role; }
    public void setName(String name) { this.name = name; }
}

