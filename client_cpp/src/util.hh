#pragma once

#include <string>
#include <tuple>

// Read inner HTML from DOM element by ID
std::string get_inner_html(const std::string& id);

// Return either the singular or plural form of a translation, depending on n
std::string pluralize(int n, const std::tuple<std::string, std::string>& word);

// Write n to out padded to 2 digits
void pad(std::string& out, unsigned int n);
